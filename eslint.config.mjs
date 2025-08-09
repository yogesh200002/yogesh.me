import { defineConfig } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import astroParser from "astro-eslint-parser";
import svelteParser from "svelte-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	{
		extends: fixupConfigRules(
			compat.extends(
				"standard-with-typescript",
				"plugin:astro/recommended",
				"plugin:astro/jsx-a11y-recommended",
				"plugin:import/recommended",
				"plugin:n/recommended",
				"plugin-promise",
				"plugin:svelte/recommended"
			)
		),
		languageOptions: {
			globals: {
				...globals.browser,
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {},
	},
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroParser,
			ecmaVersion: 5,
			sourceType: "script",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			ecmaVersion: 5,
			sourceType: "script",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	},
]);
