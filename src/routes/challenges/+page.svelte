<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Challenges</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-6 pb-16">
	<div class="mt-8 flex justify-between items-center flex-wrap gap-4">
		<h1 class="text-4xl font-bold">
			<div class="mx-auto w-fit pt-4 border-t-2 border-t-green-300">Challenges</div>
		</h1>

		<nav>
			<ol class="list-none pl-0 flex gap-x-2">
				<li class="text-blue-300 underline underline-blue-300 underline-offset-4"><a href="/">Home</a></li>
				<span class="font-semibold">&gt;</span>
				<li>Challenges</li>
			</ol>
		</nav>
	</div>

	<section id="links" class="mt-16">
		{#each data.challenges as challenge}
			<a
				href="/challenges/{challenge.slug}"
				class="block w-full px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
			>
				{challenge.title}
			</a>
		{/each}
	</section>
</div>
