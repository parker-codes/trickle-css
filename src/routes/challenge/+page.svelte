<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="max-w-6xl mx-auto">
	<h1 class="text-4xl font-bold mx-4 my-8">
		<div class="mx-auto w-fit pt-4 border-t-2 border-t-green-300">Challenges</div>
	</h1>

	<section id="links">
		{#each data.challenges as challenge}
			<a href="/challenge/{challenge.slug}">{challenge.title}</a>
		{/each}
	</section>
</div>
