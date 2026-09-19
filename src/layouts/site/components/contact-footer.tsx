import { ArrowRight, Dot } from "lucide-react";

export default function ContactFooter() {
	return (
		<footer className="mt-auto flex w-full justify-between p-5 max-sm:flex-col max-sm:gap-4">
			<div className="flex items-center gap-2">
				built by hand. no templates were harmed.
			</div>
			<div className="flex items-center justify-center max-sm:justify-start">
				<span className="mr-1 text-gray-400">say hi</span>
				<ArrowRight
					aria-hidden="true"
					className="mr-1 size-3 text-gray-400"
				/>
				<a
					className="hover:underline"
					aria-label="Mail to yogeshvishal98@gmail.com"
					href="mailto:yogeshvishal98@gmail.com">
					mail
				</a>
				<Dot aria-hidden="true" />
				<a
					className="hover:underline"
					aria-label="Link to LinkedIn"
					href="https://www.linkedin.com/in/yogesh-s-8050971a6/">
					linkedin
				</a>
				<Dot aria-hidden="true" />
				<a
					className="hover:underline"
					aria-label="Link to GitHub"
					href="https://github.com/yogesh200002/">
					github
				</a>
			</div>
		</footer>
	);
}
