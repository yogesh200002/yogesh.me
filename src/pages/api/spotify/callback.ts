import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import {
	exchangeCodeForTokens,
	putTokens,
	SPOTIFY_API_URL,
} from "@/utils/spotify";

export const prerender = false;

const errorPage = (msg: string) =>
	`/spotify/error?message=${encodeURIComponent(msg)}`;

export async function GET({ request, cookies, redirect }: APIContext) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const authError = url.searchParams.get("error");
	const savedState = cookies.get("spotify_auth_state")?.value;
	cookies.delete("spotify_auth_state", { path: "/" });

	if (authError) {
		return redirect(errorPage(`Spotify said: ${authError}`));
	}
	if (!code || !state || state !== savedState) {
		return redirect(
			errorPage("Login link expired or invalid. Start again.")
		);
	}

	try {
		const redirectUri = `${url.origin}/api/spotify/callback`;
		const tokenData = await exchangeCodeForTokens(code, redirectUri);
		if (!tokenData.refresh_token) {
			return redirect(
				errorPage(
					"Spotify did not return a refresh token. Start again."
				)
			);
		}

		const meResponse = await fetch(SPOTIFY_API_URL, {
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		});
		if (!meResponse.ok) {
			return redirect(errorPage("Couldn't reach Spotify. Try again."));
		}
		const me = (await meResponse.json()) as { id: string };
		if (me.id !== env.SPOTIFY_OWNER_ID) {
			return redirect(`/spotify/denied?id=${encodeURIComponent(me.id)}`);
		}

		await putTokens({
			refresh_token: tokenData.refresh_token,
			access_token: tokenData.access_token,
			access_token_expires_at: Date.now() + tokenData.expires_in * 1000,
			authorized_at: Date.now(),
		});

		return redirect("/spotify/connected");
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error";
		return redirect(errorPage(message));
	}
}
