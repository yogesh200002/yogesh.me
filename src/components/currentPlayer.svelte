<script>
	import Loader from "./loader.svelte";
	import MusicProgress from "./musicProgress.svelte";

	async function getCurrentPlayback() {
		const response = await fetch("/api/spotify/getCurrentPlayback");
		const responseData = await response.json();
		if (response.ok) {
			return response.status === 204 ? null : responseData.data;
		} else {
			throw new Error(responseData.message);
		}
	}

	let playbackPromise = getCurrentPlayback();
</script>

{#await playbackPromise}
	<Loader />
{:then playbackData}
	{#if playbackData != null}
		{@const { item, context, progress_ms } = playbackData}
		<div
			class="flex cursor-default flex-col shadow-md bg-zinc-100 dark:bg-slate-800 rounded-md gap-1 p-2">
			<span class="font-light text-sm">Currently Listening to</span>
			<div class="flex items-center gap-3">
				<img
					class="h-20 w-20"
					src={item.album.images[0].url}
					alt="Album Cover" />
				<div class="flex flex-col grow">
					<a
						href={context.external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-light hover:underline"
						>{item.name}</a>
					<a
						href={item.album.external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium hover:underline"
						>From {item.album.name}</a>
					<MusicProgress
						currentProgress={progress_ms}
						totalProgress={item.duration_ms} />
				</div>
			</div>
		</div>
	{/if}
{/await}
