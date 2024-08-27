<script>
	export let totalProgress = 0;
	export let currentProgress = 0;

	function getPlaybackInMinutes(playbackDuration) {
		const minutes = Math.floor(playbackDuration / 60000);
		const seconds = ((playbackDuration % 60000) / 1000).toFixed(0);
		return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}

	const currentProgressInPercent = Math.ceil(
		(currentProgress / totalProgress) * 100
	);
	const currentProgressInMins = getPlaybackInMinutes(currentProgress);
	const totalProgressInMins = getPlaybackInMinutes(totalProgress);
</script>

<div class="space-y-2">
	<div class="relative">
		<div
			class="bg-slate-300 dark:bg-slate-500 rounded-full overflow-hidden">
			<div
				style="width: {currentProgressInPercent}%;"
				class={`bg-teal-500 dark:bg-teal-400 h-2`}
				role="progressbar"
				aria-label="music progress">
			</div>
		</div>
		<div
			style="left: {currentProgressInPercent}%;"
			class={`ring-teal-500 dark:ring-teal-400 ring-2 absolute top-1/2 w-4 h-4 -mt-2 -ml-2 flex items-center justify-center bg-white rounded-full shadow`}>
			<div
				class="w-1.5 h-1.5 bg-teal-500 dark:bg-teal-400 rounded-full ring-1 ring-inset ring-slate-900/5">
			</div>
		</div>
	</div>
	<div
		class="flex justify-between text-sm leading-6 font-medium tabular-nums">
		<div class="text-teal-500 dark:text-slate-100">
			{currentProgressInMins}
		</div>
		<div class="text-teal-500 dark:text-slate-400">
			{totalProgressInMins}
		</div>
	</div>
</div>
