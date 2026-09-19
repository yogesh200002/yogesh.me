import { env } from "cloudflare:workers";

const TOKENS_KEY = "spotify:tokens";
const EXPIRY_SKEW_MS = 60_000;
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const SPOTIFY_API_URL = "https://api.spotify.com/v1/me";
export const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_SCOPES = [
	"user-read-currently-playing",
	"user-read-playback-state",
	"user-read-recently-played",
].join(" ");

export interface StoredTokens {
	refresh_token: string;
	access_token?: string;
	access_token_expires_at?: number;
	authorized_at: number;
}

interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope?: string;
}

export async function getStoredTokens(): Promise<StoredTokens | null> {
	return await env.PERSONAL_SITE_KV.get<StoredTokens>(TOKENS_KEY, "json");
}

export async function putTokens(tokens: StoredTokens): Promise<void> {
	await env.PERSONAL_SITE_KV.put(TOKENS_KEY, JSON.stringify(tokens));
}

export async function clearTokens(): Promise<void> {
	await env.PERSONAL_SITE_KV.delete(TOKENS_KEY);
}

function basicAuthHeader(): string {
	return (
		"Basic " + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)
	);
}

// swap the ?code from the callback for a fresh token set
export async function exchangeCodeForTokens(
	code: string,
	redirectUri: string
): Promise<SpotifyTokenResponse> {
	const response = await fetch(SPOTIFY_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: basicAuthHeader(),
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
		}),
	});
	if (!response.ok) {
		throw new Error(`Spotify token exchange failed (${response.status})`);
	}
	return (await response.json()) as SpotifyTokenResponse;
}

export async function getValidAccessToken(): Promise<string | null> {
	const tokens = await getStoredTokens();
	if (!tokens) {
		return null;
	}

	if (
		tokens.access_token &&
		tokens.access_token_expires_at &&
		tokens.access_token_expires_at - EXPIRY_SKEW_MS > Date.now()
	) {
		return tokens.access_token;
	}

	const response = await fetch(SPOTIFY_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: basicAuthHeader(),
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: tokens.refresh_token,
		}),
	});

	if (!response.ok) {
		if (response.status === 400) {
			await clearTokens();
		}
		return null;
	}

	const data: SpotifyTokenResponse = await response.json();
	const updated: StoredTokens = {
		...tokens,
		access_token: data.access_token,
		access_token_expires_at: Date.now() + data.expires_in * 1000,
		refresh_token: data.refresh_token ?? tokens.refresh_token,
	};
	await putTokens(updated);
	return updated.access_token || null;
}
