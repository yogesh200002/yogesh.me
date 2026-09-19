import { useContext, type CSSProperties } from "react";
import { cn } from "cnfast";
import { PlayerContent } from "./content";
import {
	PlayerContext,
	PlayerContextProvider,
	type PlayerStatus,
} from "./context";
import { PlayerHeader } from "./header";

const EQUALIZER_HEIGHTS = [3, 4, 6, 7, 5, 4, 6, 8, 7, 5, 3, 4, 6, 5, 4, 2];
const MATRIX_ROWS = 8;

const matrixDots = Array.from({ length: MATRIX_ROWS }, (_, row) => (
	<circle key={row} cx="5" cy={row * 10 + 5} r="3" />
));

function PixelGlyph({ status }: { status: Exclude<PlayerStatus, "playing"> }) {
	const className = "size-10 fill-current [shape-rendering:crispEdges]";

	if (status === "paused") {
		return (
			<svg className={className} viewBox="0 0 32 32">
				<rect x="7" y="5" width="6" height="22" />
				<rect x="19" y="5" width="6" height="22" />
			</svg>
		);
	}

	if (status === "loading") {
		return (
			<svg className={className} viewBox="0 0 32 32">
				<rect x="3" y="13" width="5" height="5" />
				<rect x="10" y="13" width="5" height="5" />
				<rect x="17" y="13" width="5" height="5" />
				<rect x="24" y="13" width="5" height="5" />
			</svg>
		);
	}

	if (status === "idle") {
		return (
			<svg className={className} viewBox="0 0 32 32">
				<path d="M3 14h4v-4h4V6h4v20h-4v-4H7v-4H3z M16 14h4v-4h4V6h4v20h-4v-4h-4v-4h-4z" />
			</svg>
		);
	}

	return (
		<svg className={className} viewBox="0 0 32 32">
			<path d="M4 4h5v5H4z M9 9h5v5H9z M14 14h4v4h-4z M18 18h5v5h-5z M23 23h5v5h-5z M23 4h5v5h-5z M18 9h5v5h-5z M9 18h5v5H9z M4 23h5v5H4z" />
		</svg>
	);
}

function PlayerGraphic({ status }: { status: PlayerStatus }) {
	if (status !== "playing") {
		return (
			<div
				className={cn(
					"flex aspect-2/1 w-[30%] max-w-40 shrink-0 flex-col items-center justify-center gap-2 text-muted uppercase",
					(status === "loading" || status === "paused") &&
						"text-amber"
				)}
				data-player-glyph={status}
				aria-hidden="true">
				<PixelGlyph status={status} />
			</div>
		);
	}

	return (
		<div
			className="flex aspect-2/1 w-[30%] max-w-40 shrink-0 text-amber"
			aria-hidden="true">
			{EQUALIZER_HEIGHTS.map((height, barIndex) => (
				<svg
					className="block h-auto min-w-0 flex-1 fill-current"
					viewBox="0 0 10 80"
					key={barIndex}
					style={
						{
							"--equalizer-delay": `${barIndex * -83}ms`,
							"--equalizer-duration": `${900 + (barIndex % 5) * 140}ms`,
							"--equalizer-low": `${(MATRIX_ROWS - Math.max(1, height - 3)) * 12.5}%`,
							"--equalizer-mid": `${(MATRIX_ROWS - Math.max(2, height - 1)) * 12.5}%`,
							"--equalizer-high": `${(MATRIX_ROWS - height) * 12.5}%`,
						} as CSSProperties
					}>
					<g className="opacity-15">{matrixDots}</g>
					<g data-equalizer-level>{matrixDots}</g>
				</svg>
			))}
		</div>
	);
}

function PlayerShell() {
	const {
		state: { status },
	} = useContext(PlayerContext);

	return (
		<section
			className="flex w-full max-w-140 flex-col border border-player-border bg-player bg-[radial-gradient(circle_at_28%_48%,color-mix(in_srgb,var(--amber)_6%,transparent),transparent_42%)] font-mono"
			aria-label="Spotify activity">
			<PlayerHeader />
			<div className="flex items-center gap-3 p-3 sm:gap-4">
				<PlayerGraphic status={status} />
				<PlayerContent />
			</div>
		</section>
	);
}

export default function Player() {
	return (
		<PlayerContextProvider>
			<PlayerShell />
		</PlayerContextProvider>
	);
}
