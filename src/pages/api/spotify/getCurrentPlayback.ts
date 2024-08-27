import { spotifyMyUrl } from "@/utils/config";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ cookies }: APIContext) {
	try {
		const accessToken = cookies.get("access_token")?.value;
		const response = await fetch(spotifyMyUrl + "/player", {
			headers: {
				Authorization: "Bearer " + accessToken,
			},
			credentials: "include",
		});
		if (response.status === 204) {
			return new Response(JSON.stringify({ message: "success" }));
		}
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
