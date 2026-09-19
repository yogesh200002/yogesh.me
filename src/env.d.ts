/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Secrets that come from .dev.vars locally / `wrangler secret put` in prod.
// The PERSONAL_SITE_KV binding is added separately in worker-configuration.d.ts.
declare namespace Cloudflare {
	interface Env {
		SPOTIFY_CLIENT_ID: string;
		SPOTIFY_CLIENT_SECRET: string;
		SPOTIFY_OWNER_ID: string;
	}
}
