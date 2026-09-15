const { NEXT_PUBLIC_BASE_DATA_SOURCE_URL: baseDataSourceUrl } = process.env;

const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
};

const getDataUrl = (path: string): string => {
  // In a Pages deployment, use same-origin Functions so the app does not
  // depend on browser CORS settings on the legacy data host. During SSR/build
  // (and local development), use the configured data server directly.
  if (typeof window !== "undefined" && !isLocalhost()) {
    return path;
  }

  const base = baseDataSourceUrl || "https://data.openfpl.com";
  return `${base.replace(/\/$/, "")}${path}`;
};

export default getDataUrl;
