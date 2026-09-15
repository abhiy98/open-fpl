# [Open FPL](https://www.openfpl.com/)

Open FPL is an open-source web application that consists of various tools for [Fantasy Premier League](https://fantasy.premierleague.com/).

## Cloudflare Pages

The `cloudflare-pages` branch is prepared for Cloudflare Pages with a static Next.js export and Pages Functions for the dynamic FPL manager endpoints.

Configure the Pages project from the repository root with:

```text
Production branch: cloudflare-pages
Build command: yarn app:build
Build output directory: packages/app/out
NODE_VERSION: 16.20.2
YARN_VERSION: 1.22.19
```

Cloudflare's current build image defaults to Yarn 4, while this repository uses a Yarn v1 lockfile. Setting `YARN_VERSION=1.22.19` is therefore required for the existing lockfile to install immutably.

Set `NEXT_PUBLIC_SITE_URL` to your public domain when you want canonical/Open Graph URLs to use that domain. Otherwise the app can use Cloudflare's injected `CF_PAGES_URL` value.

The app uses the existing `data.openfpl.com` static data service for player/team data and Cloudflare Pages Functions for browser-side `/app-data/*`, `/remote-data/*`, and `/api/entries/*` requests.

## Running Locally

```bash
yarn install
yarn app:dev
```

## Data

The project relies on static data from Fantasy Premier League and Understat. The original data-generation scripts are retained for local or scheduled use.
