import { useEffect, useState, type RefObject } from "react";

export function useIsOverflowing(ref: RefObject<HTMLElement | null>) {
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const updateOverflow = () => {
			setIsOverflowing(element.scrollWidth > element.clientWidth);
		};
		const resizeObserver = new ResizeObserver(updateOverflow);
		const mutationObserver = new MutationObserver(updateOverflow);

		updateOverflow();
		resizeObserver.observe(element);
		mutationObserver.observe(element, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [ref]);

	return isOverflowing;
}
