import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [react(), mdx()],
	// Spotify requires the development callback to use the same loopback host.
	server: { host: "127.0.0.1" },
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		ssr: {
			external: ["node:buffer"],
		},
	},
	trailingSlash: "never",
	build: {
		format: "file",
	},
	output: "static",
	adapter: cloudflare({
		platformProxy: { enabled: true },
	}),
});
