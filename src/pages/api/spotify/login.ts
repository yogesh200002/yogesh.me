import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { SPOTIFY_AUTHORIZE_URL, SPOTIFY_SCOPES } from "@/utils/spotify";

export const prerender = false;

export function GET({ request, cookies, redirect }: APIContext) {
	const origin = new URL(request.url).origin;
	const redirectUri = `${origin}/api/spotify/callback`;

	const state = crypto.randomUUID();
	cookies.set("spotify_auth_state", state, {
		path: "/",
		maxAge: 600,
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: "lax",
	});

	const params = new URLSearchParams({
		response_type: "code",
		client_id: env.SPOTIFY_CLIENT_ID,
		scope: SPOTIFY_SCOPES,
		redirect_uri: redirectUri,
		state,
	});

	return redirect(`${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`, 302);
}
