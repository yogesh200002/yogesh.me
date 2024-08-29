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
		{@const {
			item: { external_urls, album, artists, duration_ms, name },
			progress_ms,
		} = playbackData}
		<div
			class="flex cursor-default flex-col shadow-md bg-zinc-100 dark:bg-slate-800 rounded-md gap-1 p-2">
			<span class="font-light text-sm">Currently Listening to</span>
			<div class="flex items-center gap-3">
				<img
					class="h-20 w-20"
					src={album.images[0].url}
					alt="Album Cover" />
				<div class="flex flex-col grow gap-1">
					<a
						href={external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-medium hover:underline">{name}</a>
					<div class="flex gap-1">
						{#each artists as { name, external_urls: { spotify } }, index}
							<a
								href={spotify}
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm text-gray-600 dark:text-gray-300 hover:underline"
								>{index === artists.length - 1
									? name
									: name + ", "}</a>
						{/each}
					</div>
					<MusicProgress
						currentProgress={progress_ms}
						totalProgress={duration_ms} />
				</div>
			</div>
		</div>
	{/if}
{/await}
