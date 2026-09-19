import { Sun, Moon } from "lucide-react";

export default function ThemeSwitch() {
	function onThemeToggle() {
		const nextTheme = document.documentElement.classList.contains("dark")
			? "light"
			: "dark";
		localStorage.setItem("theme", nextTheme);
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute(
				"content",
				nextTheme === "dark" ? "#18191b" : "#f2f2ef"
			);
	}

	return (
		<button
			type="button"
			onClick={onThemeToggle}
			aria-label="Toggle theme"
			title="Toggle theme"
			className="cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-slate-800">
			<Moon aria-hidden="true" className="hidden size-6 dark:block" />
			<Sun aria-hidden="true" className="block size-6 dark:hidden" />
		</button>
	);
}
