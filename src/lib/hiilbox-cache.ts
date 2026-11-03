
import { getCloudflareContext } from "@opennextjs/cloudflare";

type CacheValue = {
  value: unknown;
  expiresAt: number;
};

type CacheBinding = {
  get(key: string, type: "json"): Promise<CacheValue | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
};

const pending = new Map<string, Promise<unknown>>();

async function getKV(): Promise<CacheBinding | null> {
  try {
    const context = getCloudflareContext();
    const env = context.env as unknown as {
      HIILBOX_CACHE?: CacheBinding;
    };

    return env.HIILBOX_CACHE ?? null;
  } catch {
    // Local Next.js development may not have Cloudflare bindings.
    return null;
  }
}

export async function readCache<T>(
  key: string
): Promise<T | null> {
  const kv = await getKV();
  if (!kv) return null;

  try {
    const cached = await kv.get(key, "json");

    if (!cached || cached.expiresAt <= Date.now()) {
      return null;
    }

    return cached.value as T;
  } catch {
    return null;
  }
}

export async function writeCache<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const kv = await getKV();
  if (!kv) return;

  try {
    await kv.put(
      key,
      JSON.stringify({
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      }),
      {
        expirationTtl: Math.max(60, Math.ceil(ttlSeconds)),
      }
    );
  } catch (error) {
    console.error("HiilBox cache write failed:", error);
  }
}

export async function deduplicate<T>(
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  const existing = pending.get(key);

  if (existing) {
    return existing as Promise<T>;
  }

  const task = operation();
  pending.set(key, task);

  try {
    return await task;
  } finally {
    if (pending.get(key) === task) {
      pending.delete(key);
    }
  }
}
