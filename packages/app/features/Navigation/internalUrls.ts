const {
  NEXT_PUBLIC_VERCEL_URL: vercelUrl,
  NEXT_PUBLIC_SITE_URL: configuredSiteUrl,
  CF_PAGES_URL: cloudflarePagesUrl,
} = process.env;

const normalizeOrigin = (url: string) => url.replace(/\/$/, "");

export const origin = configuredSiteUrl
  ? normalizeOrigin(configuredSiteUrl)
  : cloudflarePagesUrl
  ? normalizeOrigin(cloudflarePagesUrl)
  : vercelUrl
  ? `https://${vercelUrl}`
  : "http://localhost:3000";

export const host = (() => {
  try {
    return new URL(origin).host;
  } catch {
    return undefined;
  }
})();
