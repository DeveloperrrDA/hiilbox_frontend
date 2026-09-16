function asUrl(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) { for (const item of value) { const u=asUrl(item); if(u)return u; } return ""; }
  if (typeof value === "object") {
    for (const key of ["url","src","source_url","full_url","image_url","thumbnail_url"]) { const u=asUrl(value[key]); if(u)return u; }
    if (value.sizes) for (const key of ["medium","thumbnail","woocommerce_thumbnail","full","large"]) { const u=asUrl(value.sizes[key]); if(u)return u; }
  }
  return "";
}
export function campaignImage(value:any):string {
  if(!value)return "";
  const campaign=value?.campaign??value?.fund??value;
  const candidates=[campaign?.featured_image_url,campaign?.featured_image,campaign?.campaign_image,campaign?.image_url,campaign?.image,campaign?.thumbnail_url,campaign?.thumbnail,campaign?.cover_image,campaign?.images,campaign?.gallery,value?.campaign_image,value?.featured_image,value?.image_url,value?.image,value?.thumbnail];
  for(const c of candidates){const u=asUrl(c);if(u)return u;}
  return "";
}
