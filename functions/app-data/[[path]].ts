const DATA_ORIGIN = "https://data.openfpl.com";

export async function onRequestGet(context: any) {
  const path = Array.isArray(context.params.path)
    ? context.params.path.join("/")
    : context.params.path ?? "";

  if (path.includes("..")) {
    return new Response("Bad request", { status: 400 });
  }

  const upstream = await fetch(`${DATA_ORIGIN}/app-data/${path}`, {
    headers: { Accept: "application/json" },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
