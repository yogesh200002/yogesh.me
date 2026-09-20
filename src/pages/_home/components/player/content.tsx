import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "cnfast";
import { PlayerContext } from "./context";
import { relativeTimeFromDates } from "@/utils/relative-time";
import { Dot } from "lucide-react";
import { useIsOverflowing } from "@/utils/use-is-overflowing";

const PROGRESS_TOTAL = 18;
const ENDLESS_SCROLL_INTERVAL = 30;
const ENDLESS_SCROLL_PAUSE = 1000;
const ENDLESS_SCROLL_DURATION = 12000;
const ENDLESS_SCROLL_CYCLE =
	2 * (ENDLESS_SCROLL_DURATION + ENDLESS_SCROLL_PAUSE);

function getEndlessScrollProgress(elapsedMs: number) {
	const cycleElapsed = elapsedMs % ENDLESS_SCROLL_CYCLE;

	if (cycleElapsed < ENDLESS_SCROLL_DURATION) {
		return cycleElapsed / ENDLESS_SCROLL_DURATION;
	}

	if (cycleElapsed < ENDLESS_SCROLL_DURATION + ENDLESS_SCROLL_PAUSE) {
		return 1;
	}

	if (cycleElapsed < 2 * ENDLESS_SCROLL_DURATION + ENDLESS_SCROLL_PAUSE) {
		return (
			1 -
			(cycleElapsed - ENDLESS_SCROLL_DURATION - ENDLESS_SCROLL_PAUSE) /
				ENDLESS_SCROLL_DURATION
		);
	}

	return 0;
}

interface PlayerProgressProps {
	progressMs: number;
	durationMs: number;
	isPlaying: boolean;
	onEnded: () => void;
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
	onEnded,
}: PlayerProgressProps) {
	const [elapsedMs, setElapsedMs] = useState(0);

	useEffect(() => {
		if (!isPlaying) {
			return;
		}

		const interval = window.setInterval(() => {
			setElapsedMs((current) =>
				Math.min(current + 1000, Math.max(durationMs - progressMs, 0))
			);
		}, 1000);

		return () => window.clearInterval(interval);
	}, [durationMs, isPlaying, progressMs]);

	const currentMs = Math.min(progressMs + elapsedMs, durationMs);

	useEffect(() => {
		if (isPlaying && currentMs >= durationMs) {
			onEnded();
		}
	}, [currentMs, durationMs, isPlaying, onEnded]);

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

function PlayerTrackName() {
	const { playback } = useContext(PlayerContext);

	if (playback == null) {
		return null;
	}

	const track =
		playback.source === "history" ? playback.item.track : playback.item;

	return (
		<a
			className="block truncate font-sans text-base leading-6 font-medium text-foreground transition-colors hover:text-amber sm:text-lg"
			title={track.name}
			href={track.external_urls.spotify}
			target="_blank"
			rel="noopener noreferrer">
			{track.name}
		</a>
	);
}

function PlayerArtists() {
	const { playback } = useContext(PlayerContext);
	const artistWrpRef = useRef<HTMLDivElement>(null);
	const track =
		playback?.source === "history" ? playback.item.track : playback?.item;
	const isOverflowing = useIsOverflowing(artistWrpRef);

	useEffect(() => {
		const wrapper = artistWrpRef.current;
		if (wrapper == null) {
			return;
		}

		wrapper.scrollLeft = 0;
		if (
			!isOverflowing ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		const startedAt = performance.now();

		const interval = window.setInterval(() => {
			const maxScrollLeft = Math.max(
				0,
				wrapper.scrollWidth - wrapper.clientWidth
			);
			const elapsedMs = performance.now() - startedAt;

			wrapper.scrollLeft =
				maxScrollLeft * getEndlessScrollProgress(elapsedMs);
		}, ENDLESS_SCROLL_INTERVAL);

		return () => window.clearInterval(interval);
	}, [isOverflowing]);

	if (track == null) {
		return null;
	}

	return (
		<div
			ref={artistWrpRef}
			className="min-w-0 w-1/2 text-nowrap overflow-x-auto scrollbar-none">
			{track.artists.map(({ name, external_urls }, index) => (
				<span key={external_urls.spotify}>
					{index > 0 ? ", " : null}
					<a
						className="transition-colors hover:text-amber"
						title={name}
						href={external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer">
						{name}
					</a>
				</span>
			))}
		</div>
	);
}

function PlayerAlbum() {
	const { playback } = useContext(PlayerContext);

	if (playback == null) {
		return null;
	}

	const track =
		playback.source === "history" ? playback.item.track : playback.item;
	const album = track.album;

	return (
		<a
			className="min-w-0 truncate transition-colors hover:text-amber"
			title={album.name}
			href={album.external_urls.spotify}
			target="_blank"
			rel="noopener noreferrer">
			{album.name}
		</a>
	);
}

export function PlayerContent() {
	const {
		state: { status },
		playback,
		getCurrentPlayback,
	} = useContext(PlayerContext);
	const refreshedTrackRef = useRef<string | null>(null);
	const liveTrackId = playback?.source === "player" ? playback.item.id : null;

	useEffect(() => {
		refreshedTrackRef.current = null;
	}, [liveTrackId]);

	const handleTrackEnd = useCallback(() => {
		if (liveTrackId == null || refreshedTrackRef.current === liveTrackId) {
			return;
		}

		refreshedTrackRef.current = liveTrackId;
		getCurrentPlayback();
	}, [getCurrentPlayback, liveTrackId]);

	if (status === "loading") {
		return (
			<div
				className="flex min-w-0 flex-1 flex-col justify-center gap-1"
				aria-live="polite">
				<p className="text-xs leading-4 tracking-[0.08em] text-muted uppercase">
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
				<p className="text-xs leading-4 tracking-[0.08em] text-muted uppercase">
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
				<p className="text-xs leading-4 tracking-[0.08em] text-muted uppercase">
					Idle
				</p>
				<p className="truncate font-sans text-base leading-6 font-medium text-foreground sm:text-lg">
					Nothing played recently.
				</p>
			</div>
		);
	}

	if (playback.source === "history") {
		return (
			<div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
				<p className="text-xs leading-4 tracking-[0.08em] text-muted uppercase">
					Last played
				</p>
				<PlayerTrackName />
				<div className="flex min-w-0 items-center gap-1 text-xs leading-4.5 text-muted">
					<PlayerArtists />
					<Dot className="size-4 shrink-0" aria-hidden="true" />
					<PlayerAlbum />
				</div>
				<p className="text-xs leading-4.5 text-muted">
					Played{" "}
					{relativeTimeFromDates(new Date(playback.item.played_at))}
				</p>
			</div>
		);
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
			<PlayerTrackName />
			<div className="flex min-w-0 items-center gap-1 text-xs leading-4.5 text-muted">
				<PlayerArtists />
				<Dot className="size-4 shrink-0" aria-hidden="true" />
				<PlayerAlbum />
			</div>
			<PlayerProgress
				key={`${playback.item.id}-${playback.progress_ms}-${status}`}
				progressMs={playback.progress_ms ?? 0}
				durationMs={playback.item.duration_ms}
				isPlaying={status === "playing"}
				onEnded={handleTrackEnd}
			/>
		</div>
	);
}
