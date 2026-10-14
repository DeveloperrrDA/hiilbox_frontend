export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    let id: string | null = null;

    if (host === "youtu.be") {
      id = parsed.pathname.split("/")[1];
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "watch") {
        id = parsed.searchParams.get("v");
      } else if (["embed", "shorts", "live"].includes(parts[0])) {
        id = parts[1];
      }
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url?: string | null) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}