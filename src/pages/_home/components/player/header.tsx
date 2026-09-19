import { useContext } from "react";
import { cn } from "cnfast";
import { PlayerContext } from "./context";

const labels = {
	loading: "scan",
	playing: "live",
	paused: "paused",
	idle: "idle",
	error: "offline",
} as const;

export function PlayerHeader() {
	const {
		state: { status, isSyncing },
	} = useContext(PlayerContext);

	const hasWarmStatus = status === "loading" || status === "paused";
	const hasMutedStatus = status === "idle" || status === "error";

	return (
		<header className="flex h-8 items-center justify-between border-b border-line px-3 text-xs leading-4.5 text-muted">
			<span>Spotify</span>
			<span
				className={cn(
					"flex items-center gap-2 text-[11px] leading-4 tracking-[0.08em] text-olive uppercase",
					hasWarmStatus && "text-amber",
					hasMutedStatus && "text-muted"
				)}>
				<span
					className={cn(
						"size-1.5 rounded-full bg-olive shadow-[0_0_10px_color-mix(in_srgb,var(--olive)_42%,transparent)]",
						hasWarmStatus &&
							"bg-amber shadow-[0_0_10px_color-mix(in_srgb,var(--amber)_42%,transparent)]",
						hasMutedStatus && "bg-muted shadow-none"
					)}
					data-blink={status === "playing" ? "" : undefined}
					data-pulse={
						status === "loading" || isSyncing ? "" : undefined
					}
				/>
				{labels[status]}
			</span>
		</header>
	);
}
