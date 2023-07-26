<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import DOMPurify from 'isomorphic-dompurify';
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import {
		getSavedChallengeStyles,
		saveChallengeStyles,
		clearSavedChallengeStyles,
	} from '$lib/models/challenge';
	import { getPercentCompleted, type VerifiedTask } from '$lib/models/task';
	import { verify } from '$lib/models/requirement';
	import { debounce } from '$lib/utils/misc';
	import type { PageData } from './$types';
	import ResetIcon from '$lib/components/icons/ResetIcon.svelte';

	export let data: PageData;

	let styles = data.startingStyles;

	/**
	 * Verifying tasks
	 */

	let verifiedTasks: VerifiedTask[] = [];

	async function verifyAllTasks(): Promise<void> {
		await tick(); // wait for styles to apply before checking

		verifiedTasks = data.tasks.map((task) => ({
			...task,
			completed: verify(task.requirement),
		}));
	}

	$: percentComplete = getPercentCompleted(verifiedTasks);

	/**
	 * Persisting styles
	 */

	onMount(() => {
		const savedStyles = getSavedChallengeStyles(data.slug);
		if (savedStyles) styles = savedStyles;
	});

	function persistStyles(): void {
		saveChallengeStyles(data.slug, styles);
	}
	const debouncedPersistStyles = debounce(persistStyles, 10_00);

	function resetStyles(): void {
		styles = data.startingStyles;
		clearSavedChallengeStyles(data.slug);
	}

	function stylesChanged(_styles: string): void {
		verifyAllTasks();
		debouncedPersistStyles();
	}
	$: stylesChanged(styles);

	/**
	 * Sanitization
	 */

	$: safeStyles = DOMPurify.sanitize(styles);
	$: safeMarkup = DOMPurify.sanitize(data.markup);
</script>

<svelte:head>
	<title>Challenge: {data.title}</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-6 pb-16">
	<div class="mt-8 flex justify-between items-center flex-wrap gap-4">
		<h1 class="text-4xl font-bold">
			<div class="mx-auto w-fit pt-4 border-t-2 border-t-green-300">{data.title}</div>
		</h1>

		<nav>
			<ol class="list-none pl-0 flex gap-x-2">
				<li class="text-blue-300 underline underline-blue-300 underline-offset-4"><a href="/">Home</a></li>
				<span class="font-semibold">&gt;</span>
				<li class="text-orange-300 underline underline-orange-300 underline-offset-4"><a href="/challenges">Challenges</a></li>
				<span class="font-semibold">&gt;</span>
				<li class="">{data.title}</li>
			</ol>
		</nav>
	</div>

	<section id="tasks" class="mt-16 px-6 border-l-2 border-l-red-300">
		<h2 class="text-2xl font-bold mb-4">Instructions</h2>
		<p>Style the three balls to look like a snowman.</p>

		<ul class="mt-4">
			{#each verifiedTasks as task}
				<li class="flex gap-2 mt-1 first:mt-0">
					<span class={task.completed ? 'text-green-400' : 'opacity-20'}>✓</span>
					<span>{task.text}</span>
				</li>
			{/each}
		</ul>

		<p class="mt-2 opacity-60">{percentComplete}% complete</p>
	</section>

	<div class="mt-16 flex items-start flex-wrap gap-x-6 gap-y-16">
		<section id="editors" class="flex-grow basis-96 flex flex-col justify-between gap-y-4">
			<CodeMirror
				value={data.markup}
				lang={html()}
				theme={oneDark}
				readonly
				class="rounded overflow-clip"
			/>

			<div>
				<CodeMirror
					bind:value={styles}
					lang={css()}
					theme={oneDark}
					class="rounded overflow-clip"
				/>
				<button
					on:click={resetStyles}
					class="rounded px-2 py-1 mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-white flex gap-1"
				>
					<ResetIcon class="w-3 h-3 translate-y-px" />
					Reset
				</button>
			</div>
		</section>

		<section
			id="preview"
			class="flex-grow basis-96 p-6 rounded border-2 border-dashed border-gray-200/10"
		>
			{@html `<style>${safeStyles}</style>`}
			{@html safeMarkup}
		</section>
	</div>
</div>