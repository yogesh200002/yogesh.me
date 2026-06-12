import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	integrations: [svelte(), mdx()],
	vite: {
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		ssr: {
			external: ["node:buffer"],
		},
	},
	output: "static",
	adapter: cloudflare(),
});
