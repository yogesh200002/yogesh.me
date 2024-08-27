/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {
		env: {
			readonly SPOTIFY_CLIENT_ID: string;
			readonly SPOTIFY_CLIENT_SECRET: string;
			readonly SPOTIFY_REFRESH_TOKEN: string;
		};
	}
}
