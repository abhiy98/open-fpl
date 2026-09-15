# [Open FPL](https://www.openfpl.com/)

Open FPL is a open-source web application that consists of various tools for
[Fantasy Premier League](https://fantasy.premierleague.com/). It aims to
complement the game experience and bring out the best from the team manager by
providing statistics, data visualisation and other utility tools.

## Overview

- `app/*`: Application code
- `data/*`: Data files and its generation scripts for that application
- `common/*`: Shared code accross the applications
- `www/*`: Landing page code
- `functions/*`: Cloudflare Pages Functions used for FPL/data API proxying

## Running Locally

```bash
$ git clone https://github.com/bapairaew/open-fpl.git
$ cd open-fpl
$ npx lerna bootstrap

# Depending on what you have installed globally, you might have to install "yarn" and/or "ts-node" for the steps below
$ yarn data:init # This will take ~6+ min to download and setup remote test data
$ yarn data:dev # On one terminal
$ yarn app:dev # On another terminal
```

## Cloudflare Pages

The `cloudflare-pages` branch is prepared for a static Next.js export with
Cloudflare Pages Functions for the dynamic Team Planner API calls. Cloudflare's
Pages documentation uses `npx next build` with the `out` directory for a Next.js
static export.

Use these Pages settings from the repository root:

```text
Production branch: cloudflare-pages
Build command: yarn app:build
Build output directory: packages/app/out
Node version: 20 (the repository includes .nvmrc)
```

The app uses the existing `data.openfpl.com` data service during the build and
proxies browser requests through the Pages Functions under `/app-data/*` and
`/remote-data/*`. Team Planner manager requests are proxied under `/api/entries/*`.

Set `NEXT_PUBLIC_SITE_URL` in Cloudflare Pages when you want canonical/Open Graph
URLs to use a custom domain. Otherwise the build can use Cloudflare's injected
`CF_PAGES_URL` value.

## E2E Testing

```bash
$ yarn e2e:dev:server:app # Start app server with production build for testing
$ yarn e2e:dev:app # Start E2E testing
```

You can change `app` to other packages to test those.

## Stack

- [Next.js](https://nextjs.org)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Chakra UI](https://chakra-ui.com)
- [Cypress](https://www.cypress.io)

## Data

The project relies on static data from
[Fantasy Premier League](https://fantasy.premierleague.com/) and
[Understat](https://understat.com/). There is a script to pull the data from the
those sources in this project. By default, the script will get the data one page
at a time to avoid too much workload on those sources. So please be mindful with
the set up if you are going to use it.
