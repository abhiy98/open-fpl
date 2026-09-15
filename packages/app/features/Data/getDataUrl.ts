const { NEXT_PUBLIC_BASE_DATA_SOURCE_URL: baseDataSourceUrl } = process.env;

const getDataUrl = (path: string): string => {
  const base = baseDataSourceUrl || "https://data.openfpl.com";
  return `${base.replace(/\/$/, "")}${path}`;
};

export default getDataUrl;
