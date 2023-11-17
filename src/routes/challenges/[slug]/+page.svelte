<script lang="ts">
	import { useMachine } from '@xstate/svelte';
	import { challengeMachine } from '$lib/machines/challenge.machine';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import { getPercentCompleted } from '$lib/models/task';
	import type { PageData } from './$types';
	import ResetIcon from '$lib/components/icons/ResetIcon.svelte';

	export let data: PageData;

	const { state, send } = useMachine(challengeMachine);

	$: percentComplete = getPercentCompleted($state.context.verifiedTasks);
</script>

<svelte:head>
	<title>Challenge: {data.title}</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-6 pb-16">
	<div class="mt-8 flex justify-between items-center flex-wrap gap-4">
		<h1 class="text-4xl font-bold">
			<div class="mx-auto w-fit pt-4 border-t-2 border-t-indigo-300">{data.title}</div>
		</h1>

		<nav>
			<ol class="list-none pl-0 flex gap-x-2">
				<li class="text-blue-300 underline underline-blue-300 underline-offset-4">
					<a href="/">Home</a>
				</li>
				<span class="font-semibold">&gt;</span>
				<li class="text-orange-300 underline underline-orange-300 underline-offset-4">
					<a href="/challenges">Challenges</a>
				</li>
				<span class="font-semibold">&gt;</span>
				<li class="">{data.title}</li>
			</ol>
		</nav>
	</div>

	<section id="tasks" class="mt-16 px-6 border-l-2 border-l-red-300">
		<h2 class="text-2xl font-bold mb-4">Instructions</h2>
		<!-- TODO: support markdown in intro -->
		<p>{data.intro}</p>

		<ul class="mt-6">
			{#each $state.context.verifiedTasks as task}
				<li class="flex gap-2 mt-1 first:mt-0">
					<span class={task.completed ? 'text-green-300' : 'opacity-20'}>✓</span>
					<!-- TODO: support markdown in text -->
					<span>{task.text}</span>
				</li>
			{/each}
		</ul>

		<p class="mt-2 opacity-60">{percentComplete}% complete</p>
	</section>

	<div class="mt-16 flex items-start flex-wrap gap-x-6 gap-y-16">
		<section
			id="editors"
			class="max-w-full flex-grow basis-96 flex flex-col justify-between gap-y-4"
		>
			<CodeEditor
				value={data.markup}
				lang={html()}
				langLabel="HTML"
				theme={oneDark}
				readonly
				collapsable
				class="rounded overflow-clip "
			/>

			<div>
				<CodeEditor
					value={$state.context.styles}
					on:change={(e) => send({ type: 'STYLES_CHANGED', value: e.detail })}
					lang={css()}
					langLabel="CSS"
					theme={oneDark}
					collapsable
					class="styles-editor rounded overflow-clip"
				/>
				<button
					on:click={() => send({ type: 'RESET_STYLES' })}
					class="rounded px-2 py-1 mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-white flex gap-1"
				>
					<ResetIcon class="w-3 h-3 translate-y-px" />
					Reset
				</button>
			</div>
		</section>

		<section
			id="preview"
			class="flex-grow basis-96 p-6 rounded border-2 border-dashed border-gray-200/10 overflow-hidden"
		>
			<Preview
				iframeHeight={$state.context.previewHeight}
				on:load={(e) =>
					send({
						type: 'PREVIEW_FRAME_READY',
						frameDoc: e.detail,
						challenge: data,
					})}
			/>
		</section>
	</div>
</div>

<style>
	/* allow styles editor to be taller on mobile */
	@media screen and (max-width: 639px) {
		:global(.styles-editor) {
			--editor-max-height: 26rem;
		}
	}
</style>
