# Yogesh.me

Personal website built with Astro, React, TypeScript, and Tailwind CSS. It is
deployed through Cloudflare and includes a Spotify activity widget backed by
Cloudflare KV.

## Requirements

- Node.js 24 or newer
- pnpm 11.27.0

The repository pins pnpm through the `packageManager` field in `package.json`.
If your Node installation includes Corepack, enable it before installing:

```sh
pnpm install
```

## Local development

Create the local Cloudflare secrets file:

```sh
cp .dev.vars.example .dev.vars
```

Fill in the Spotify values, then start Astro:

```sh
pnpm dev
```

The site runs at `http://127.0.0.1:4321`.

To connect the Spotify widget, configure this callback URL in the Spotify app:

```text
http://127.0.0.1:4321/api/spotify/callback
```

Then visit `/api/spotify/login` locally and complete the authorization flow.

## Environment

| Variable                | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | Spotify application client ID                 |
| `SPOTIFY_CLIENT_SECRET` | Spotify application client secret             |
| `SPOTIFY_OWNER_ID`      | Spotify account allowed to connect the widget |

Local values belong in `.dev.vars`, which is ignored by Git. Production values
must be stored as Cloudflare secrets:

```sh
pnpm exec wrangler secret put SPOTIFY_CLIENT_ID
pnpm exec wrangler secret put SPOTIFY_CLIENT_SECRET
pnpm exec wrangler secret put SPOTIFY_OWNER_ID
```

The `PERSONAL_SITE_KV` binding is configured in `wrangler.jsonc`.

## Commands

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Start the Astro development server         |
| `pnpm build`        | Type-check and create the production build |
| `pnpm preview`      | Preview through Wrangler on port 4321      |
| `pnpm lint`         | Run ESLint                                 |
| `pnpm format`       | Format the repository with Prettier        |
| `pnpm format:check` | Check formatting without changing files    |
| `pnpm deploy:dry`   | Validate the Cloudflare deployment bundle  |
| `pnpm deploy`       | Deploy to Cloudflare                       |

## Dependency policy

`pnpm-workspace.yaml` keeps local and CI installs consistent, delays newly
published dependency versions for 24 hours, and explicitly allows build scripts
only for reviewed native dependencies. Do not approve another dependency build
script without checking what it executes and why it is required.
