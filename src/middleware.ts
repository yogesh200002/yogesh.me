import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url, cookies }, next) => {
	if (
		url.pathname.includes("spotify") &&
		url.pathname.includes("refreshToken") === false
	) {
		try {
			const accessToken = cookies.get("access_token")?.value;
			if (accessToken == null) {
				const response = await fetch(
					url.origin + "/api/spotify/refreshToken"
				);
				const { data } = await response.json();
				cookies.set("access_token", data.access_token, {
					path: "/",
					maxAge: data.expires_in,
					secure: import.meta.env.PROD,
					sameSite: "strict",
					httpOnly: true,
				});
			}
		} catch (error: any) {
			console.log(error.message);
		} finally {
			return next();
		}
	}
	return next();
});
