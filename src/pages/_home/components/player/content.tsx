import { useContext, useEffect, useState } from "react";
import { cn } from "cnfast";
import { PlayerContext } from "./context";
import { relativeTimeFromDates } from "@/utils/relative-time";

const PROGRESS_TOTAL = 18;

interface PlayerProgressProps {
	progressMs: number;
	durationMs: number;
	isPlaying: boolean;
}

function formatPlaybackTime(durationMs: number) {
	const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function PlayerProgress({
	progressMs,
	durationMs,
	isPlaying,
}: PlayerProgressProps) {
	const [elapsedMs, setElapsedMs] = useState(0);

	useEffect(() => {
		if (!isPlaying) {
			return;
		}

		const interval = window.setInterval(() => {
			setElapsedMs((current) => current + 1000);
		}, 1000);

		return () => window.clearInterval(interval);
	}, [isPlaying]);

	const currentMs = Math.min(progressMs + elapsedMs, durationMs);
	const completedDots =
		durationMs > 0
			? Math.round((currentMs / durationMs) * PROGRESS_TOTAL)
			: 0;

	return (
		<div className="flex items-center gap-2 pt-1">
			<span className="text-xs leading-4.5 text-muted">
				{formatPlaybackTime(currentMs)}
			</span>
			<div
				className="flex min-w-0 flex-1 items-center justify-between gap-px"
				aria-hidden="true">
				{Array.from({ length: PROGRESS_TOTAL }).map((_, index) => (
					<span
						className={cn(
							"aspect-square w-full max-w-1.25 min-w-0 rounded-full bg-line",
							index < completedDots && "bg-amber"
						)}
						key={index}
					/>
				))}
			</div>
			<span className="text-xs leading-4.5 text-muted">
				{formatPlaybackTime(durationMs)}
			</span>
		</div>
	);
}

export function PlayerContent() {
	const {
		state: { status },
		playback,
	} = useContext(PlayerContext);

	if (status === "loading") {
		return (
			<div
				className="flex min-w-0 flex-1 flex-col justify-center gap-1"
				aria-live="polite">
				<p className="text-[11px] leading-4 tracking-[0.08em] text-muted uppercase">
					Connecting
				</p>
				<p className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg">
					Searching Spotify…
				</p>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div
				className="flex min-w-0 flex-1 flex-col justify-center gap-1"
				aria-live="polite">
				<p className="text-[11px] leading-4 tracking-[0.08em] text-muted uppercase">
					No signal
				</p>
				<p className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg">
					Spotify is keeping quiet.
				</p>
			</div>
		);
	}

	if (playback == null) {
		return (
			<div
				className="flex min-w-0 flex-1 flex-col justify-center gap-1"
				aria-live="polite">
				<p className="text-[11px] leading-4 tracking-[0.08em] text-muted uppercase">
					Idle
				</p>
				<p className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg">
					Nothing played recently.
				</p>
			</div>
		);
	}

	if (playback.source === "history") {
		const track = playback.item.track;
		const artists = track.artists.map((artist) => artist.name).join(", ");

		return (
			<div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
				<p className="text-[11px] leading-4 tracking-[0.08em] text-muted uppercase">
					Last played
				</p>
				<p
					className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg"
					title={track.name}>
					{track.name}
				</p>
				<p className="truncate text-xs leading-4.5 text-muted">
					{artists} · {track.album.name}
				</p>
				<p className="text-xs leading-4.5 text-muted">
					Played{" "}
					{relativeTimeFromDates(new Date(playback.item.played_at))}
				</p>
			</div>
		);
	}

	const artists = playback.item.artists
		.map((artist) => artist.name)
		.join(", ");

	return (
		<div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
			<p
				className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg"
				title={playback.item.name}>
				{playback.item.name}
			</p>
			<p className="truncate text-xs leading-4.5 text-muted">
				{artists} · {playback.item.album.name}
			</p>
			<PlayerProgress
				key={`${playback.item.id}-${playback.progress_ms}-${status}`}
				progressMs={playback.progress_ms ?? 0}
				durationMs={playback.item.duration_ms}
				isPlaying={status === "playing"}
			/>
		</div>
	);
}
