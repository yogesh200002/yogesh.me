/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Project bindings. Cloudflare runtime APIs come from worker-configuration.d.ts.
declare namespace Cloudflare {
	interface Env {
		PERSONAL_SITE_KV: KVNamespace;
		SPOTIFY_CLIENT_ID: string;
		SPOTIFY_CLIENT_SECRET: string;
		SPOTIFY_OWNER_ID: string;
	}
}
