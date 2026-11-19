export interface Env {
  growfund_db: D1Database; 
  GROWFUND_CLIENT_API_KEY: string;
}

export async function fetchAllPages(urlBase: string, headers: Record<string, string>, limit: number) {
  const glue = urlBase.includes('?') ? '&' : '?';
  const firstRes = await fetch(`${urlBase}${glue}page=1&per_page=${limit}`, { headers });
  const firstJson = await (firstRes.json() as any);
  
  const results = Array.isArray(firstJson?.data?.results) 
    ? firstJson.data.results 
    : Array.isArray(firstJson?.data) ? firstJson.data : [];
  
  const total = firstJson?.total ?? firstJson?.data?.total ?? firstJson?.overall ?? 0;
  const totalPages = Math.ceil(total / limit);

  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(
        fetch(`${urlBase}${glue}page=${i}&per_page=${limit}`, { headers })
          .then(r => r.json())
          .then((j: any) => Array.isArray(j?.data?.results) ? j.data.results : Array.isArray(j?.data) ? j.data : [])
      );
    }
    const extraPages = await Promise.all(promises);
    for (const pageData of extraPages) {
      results.push(...pageData);
    }
  }
  return results;
}