export default function CampaignLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1218px] px-6 py-10">
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-6 h-9 w-3/4 animate-pulse rounded bg-gray-200" />

            <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-200" />

            <div className="mt-8 space-y-4">
              <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <aside>
            <div className="rounded-2xl border border-gray-200 p-6">
              <div className="mb-6 h-8 w-2/3 animate-pulse rounded bg-gray-200" />

              <div className="mb-6 h-4 w-full animate-pulse rounded bg-gray-200" />

              <div className="h-12 w-full animate-pulse rounded-full bg-gray-200" />

              <div className="mt-8 space-y-4">
                <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}