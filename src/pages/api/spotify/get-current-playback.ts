import { getValidAccessToken, SPOTIFY_API_URL } from "@/utils/spotify";

export const prerender = false;

function empty() {
	return new Response(null, { status: 204 });
}

function json(data: unknown) {
	return new Response(JSON.stringify({ message: "success", data }), {
		headers: { "Content-Type": "application/json" },
	});
}

export async function GET() {
	const accessToken = await getValidAccessToken();
	if (!accessToken) {
		return empty();
	}

	const headers = { Authorization: `Bearer ${accessToken}` };

	const playerRes = await fetch(`${SPOTIFY_API_URL}/player`, { headers });
	if (playerRes.ok && playerRes.status !== 204) {
		const data = (await playerRes.json()) as {
			item?: unknown;
			is_playing?: boolean;
			progress_ms?: number;
		};
		if (data?.item) {
			return json({
				source: "player",
				isPlaying: data.is_playing === true,
				item: data.item,
				progress_ms: data.progress_ms,
			});
		}
	}

	const recentRes = await fetch(
		`${SPOTIFY_API_URL}/player/recently-played?limit=1`,
		{ headers }
	);
	if (recentRes.ok) {
		const recent = (await recentRes.json()) as {
			items?: { track?: unknown }[];
		};
		const item = recent?.items?.[0];
		if (item) {
			return json({ source: "history", isPlaying: false, item });
		}
	}

	return empty();
}
