import { spotifyTokenUrl } from "@/utils/config";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ locals }: APIContext) {
	try {
		const { env } = locals.runtime;
		const refreshToken = env.SPOTIFY_REFRESH_TOKEN;
		const clientId = env.SPOTIFY_CLIENT_ID;
		const clientSecret = env.SPOTIFY_CLIENT_SECRET;
		const getUrl =
			spotifyTokenUrl +
			"/?" +
			new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
			}).toString();
		const response = await fetch(getUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(clientId + ":" + clientSecret).toString(
						"base64"
					),
			},
		});
		const responseData = await response.json();
		if (response.ok) {
			return new Response(
				JSON.stringify({ message: "success", data: responseData })
			);
		} else {
			return new Response(
				JSON.stringify({ message: responseData.error }),
				{
					status: response.status,
				}
			);
		}
	} catch (error: any) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500,
		});
	}
}
