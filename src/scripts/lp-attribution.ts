// Query wins over legacy campaign parameters appended after #cta-final.
export function acquisitionParams(pageUrl: string): URLSearchParams {
  const url = new URL(pageUrl);
  const params = new URLSearchParams(url.search);
  const separator = url.hash.search(/[?&]/);
  if (separator < 0) return params;
  const fragment = new URLSearchParams(url.hash.slice(separator + 1));
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
    'hsa_cam', 'gad_campaignid', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'fb_campaign_id', 'fb_ad_id']) {
    if (!params.get(key)?.trim() && fragment.get(key)?.trim()) params.set(key, fragment.get(key)!);
  }
  return params;
}
