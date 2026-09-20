import {
	createContext,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

interface Artist {
	name: string;
	external_urls: { spotify: string };
}

interface PlaybackItemTrack {
	external_urls: { spotify: string };
	album: {
		images: { url: string }[];
		name: string;
		external_urls: { spotify: string };
	};
	played_at: string;
	artists: Artist[];
	duration_ms: number;
	name: string;
	id: string;
}

interface HistoryPlayback {
	source: "history";
	isPlaying: false;
	item: {
		track: PlaybackItemTrack;
		played_at: string;
	};
}

interface PlayerPlayback {
	source: "player";
	isPlaying: boolean;
	item: PlaybackItemTrack;
	progress_ms?: number;
}

type Playback = PlayerPlayback | HistoryPlayback;
export type PlayerStatus = "loading" | "playing" | "paused" | "idle" | "error";

interface PlayerContextValue {
	state: {
		status: PlayerStatus;
		isSyncing: boolean;
	};
	playback: Playback | null;
	getCurrentPlayback: () => void;
}

export const PlayerContext = createContext<PlayerContextValue>({
	state: {
		status: "loading",
		isSyncing: false,
	},
	playback: null,
	getCurrentPlayback: () => undefined,
});

export function PlayerContextProvider({ children }: { children: ReactNode }) {
	const [requestStatus, setRequestStatus] = useState<
		"loading" | "ready" | "error"
	>("loading");
	const [isSyncing, setIsSyncing] = useState(false);
	const [playback, setPlayback] = useState<Playback | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const requestCurrentPlayback = useCallback(async () => {
		abortControllerRef.current?.abort();
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		try {
			const response = await fetch("/api/spotify/get-current-playback", {
				signal: abortController.signal,
			});
			if (response.status === 204) {
				if (!abortController.signal.aborted) {
					setPlayback(null);
					setRequestStatus("ready");
				}
				return;
			}
			const responseData = (await response.json()) as {
				message: string;
				data?: Playback | null;
			};
			if (!response.ok) {
				throw new Error(responseData.message);
			}
			if (!abortController.signal.aborted) {
				setPlayback(responseData.data ?? null);
				setRequestStatus("ready");
			}
		} catch {
			if (!abortController.signal.aborted) {
				setRequestStatus("error");
			}
		} finally {
			if (abortControllerRef.current === abortController) {
				abortControllerRef.current = null;
				setIsSyncing(false);
			}
		}
	}, []);

	const getCurrentPlayback = useCallback(() => {
		setIsSyncing(true);
		void requestCurrentPlayback();
	}, [requestCurrentPlayback]);

	useEffect(() => {
		async function loadInitialPlayback() {
			await requestCurrentPlayback();
		}

		void loadInitialPlayback();
		const interval = window.setInterval(getCurrentPlayback, 60 * 2 * 1000);

		return () => {
			window.clearInterval(interval);
			abortControllerRef.current?.abort();
		};
	}, [getCurrentPlayback, requestCurrentPlayback]);

	const status: PlayerStatus = (() => {
		if (["loading", "error"].includes(requestStatus))
			return requestStatus as PlayerStatus;
		if (playback?.source === "player") {
			return playback.isPlaying ? "playing" : "paused";
		}
		return "idle";
	})();

	return (
		<PlayerContext.Provider
			value={{
				state: { status, isSyncing },
				playback,
				getCurrentPlayback,
			}}>
			{children}
		</PlayerContext.Provider>
	);
}
