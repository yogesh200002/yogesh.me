/** @type {import('tailwindcss').Config} */

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}"],
	darkMode: "selector",
	theme: {
		extend: {
			fontFamily: {
				corinthia: ["Corinthia"],
				"corinthia-bold": ["Corinthia Bold"],
				urbanist: ["Urbanist"],
				"urbanist-italic": ["Urbanist Italic"],
			},
		},
	},
	plugins: [],
};
