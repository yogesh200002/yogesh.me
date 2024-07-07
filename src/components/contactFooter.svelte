<script>
	import GithubLogo from "@/assets/logo/github.svg?raw";
	import SvelteLogo from "@/assets/logo/svelte.svg?raw";
	import AstroLogo from "@/assets/logo/astro.svg?raw";
	import { Send, Linkedin } from "lucide-svelte";
</script>

<footer
	class="mt-auto w-full flex justify-between p-5 border-t border-t-solid border-t-slate-400">
	<div class="flex gap-2 items-center">
		Made with <a
			href="https://astro.build/"
			class="*:h-6 *:w-6 *:dark:fill-white *:fill-black"
			id="astroLogo">
			{@html AstroLogo}
		</a>
		and
		<a
			href="https://svelte.dev/"
			class="*:dark:fill-white *:fill-black"
			id="svelteLogo">
			{@html SvelteLogo}
		</a>
	</div>
	<div class="flex gap-4 items-center justify-center">
		<a
			aria-label="Mail to yogeshvishal98@gmail.com"
			href="mailto:yogeshvishal98@gmail.com">
			<Send />
		</a>
		<a
			aria-label="LinkedIn Logo"
			href="https://www.linkedin.com/in/yogesh-s-8050971a6/">
			<Linkedin xlink:title="LinkedIn Logo" />
		</a>
		<a
			class="*:dark:fill-white *:fill-black"
			href="https://github.com/yogesh200002/">
			{@html GithubLogo}
		</a>
	</div>
</footer>
