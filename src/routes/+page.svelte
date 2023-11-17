<script lang="ts">
	const trickleShared = 'w-fit px-2 py-1 border-blue-300 border-t-2 border-r-2';
</script>

<div class="max-w-6xl mx-auto px-6 pb-16">
	<h1 class="text-4xl font-bold mx-4 my-8">
		<div class="mx-auto w-fit pt-4 border-t-2 border-t-blue-300">Trickle CSS</div>
	</h1>

	<h2 class="mt-14 mx-auto w-fit text-2xl font-bold text-center">
		Learn the cascade
		<span class="mt-4 grid grid-cols-[auto, auto, auto, auto, auto] grid-rows-5">
			<span class="{trickleShared} col-start-1 row-start-1">one</span>
			<span class="{trickleShared} col-start-2 row-start-2">step</span>
			<span class="{trickleShared} col-start-3 row-start-3">at</span>
			<span class="{trickleShared} col-start-4 row-start-4">a</span>
			<span class="{trickleShared} col-start-5 row-start-5">time.</span>
		</span>
	</h2>

	<section class="mt-24 flex justify-center">
		<a href="/challenges" class="px-4 py-2 rounded bg-indigo-300 text-slate-900 font-semibold">
			View challenges
		</a>
	</section>
</div>
