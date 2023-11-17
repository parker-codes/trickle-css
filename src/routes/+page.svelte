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

	<section class="mt-24 flex justify-center items-center gap-10">
		<a href="/challenges" class="px-4 py-2 rounded bg-orange-300 text-slate-900 font-semibold">
			View challenges
		</a>

		<a
			target="_blank"
			href="https://github.com/parker-codes/trickle-css"
			class="px-4 py-2 rounded bg-indigo-300 text-slate-900 font-semibold flex items-center gap-3"
		>
			View source
			<svg
				aria-label="GitHub repository"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M15 22V18C15.1392 16.7473 14.78 15.4901 14 14.5C17 14.5 20 12.5 20 9C20.08 7.75 19.73 6.52 19 5.5C19.28 4.35 19.28 3.15 19 2C19 2 18 2 16 3.5C13.36 3 10.64 3 8.00004 3.5C6.00004 2 5.00004 2 5.00004 2C4.70004 3.15 4.70004 4.35 5.00004 5.5C4.27191 6.51588 3.91851 7.75279 4.00004 9C4.00004 12.5 7.00004 14.5 10 14.5C9.61004 14.99 9.32004 15.55 9.15004 16.15C8.98004 16.75 8.93004 17.38 9.00004 18V22"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M9 18C4.49 20 4 16 2 16"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</section>
</div>
