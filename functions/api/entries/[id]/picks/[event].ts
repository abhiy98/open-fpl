const FPL_ORIGIN = "https://fantasy.premierleague.com/api";

export async function onRequestGet(context: any) {
  const id = Array.isArray(context.params.id)
    ? context.params.id[0]
    : context.params.id;
  const event = Array.isArray(context.params.event)
    ? context.params.event[0]
    : context.params.event;

  if (!/^\d+$/.test(id ?? "") || !/^\d+$/.test(event ?? "")) {
    return Response.json(
      { error: "Invalid FPL entry or gameweek ID" },
      { status: 400 }
    );
  }

  const upstream = await fetch(
    `${FPL_ORIGIN}/entry/${id}/event/${event}/picks/`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Open-FPL/Cloudflare-Pages",
      },
    }
  );

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
