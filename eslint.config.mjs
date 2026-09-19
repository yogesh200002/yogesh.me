import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig(
	{
		ignores: [
			"dist/",
			".astro/",
			".wrangler/",
			"worker-configuration.d.ts",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	reactHooks.configs.flat.recommended,
	...astro.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	{
		// Astro generates env.d.ts with triple-slash refs — that's expected here
		files: ["**/*.d.ts"],
		rules: { "@typescript-eslint/triple-slash-reference": "off" },
	}
);
