<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import {
		getSavedChallengeStyles,
		saveChallengeStyles,
		clearSavedChallengeStyles,
	} from '$lib/models/challenge';
	import { getPercentCompleted, type Task, type VerifiedTask } from '$lib/models/task';
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
</script>

<div class="max-w-6xl mx-auto">
	<h1 class="text-4xl font-bold mx-4 my-8">
		<div class="mx-auto w-fit pt-4 border-t-2 border-t-green-300">Style By Number</div>
	</h1>

	<section id="editors" class="mt-20 flex justify-between gap-x-4">
		<div class="flex-auto">
			<CodeMirror bind:value={styles} lang={css()} theme={oneDark} class="rounded overflow-clip" />
			<button
				on:click={resetStyles}
				class="rounded px-2 py-1 mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-white flex gap-1"
			>
				<ResetIcon class="w-3 h-3 translate-y-px" />
				Reset
			</button>
		</div>
		<CodeMirror
			value={data.markup}
			lang={html()}
			theme={oneDark}
			readonly
			class="flex-auto rounded overflow-clip"
		/>
	</section>

	<section id="tasks" class="mt-20 px-6 border-l-2 border-l-red-300">
		<h2 class="text-2xl font-bold mb-4">Instructions</h2>
		<p>Style the three balls to look like a snowman.</p>

		<ul class="mt-4">
			{#each verifiedTasks as task}
				<li>
					<span class={task.completed ? 'text-green-400' : 'opacity-20'}>✓</span>
					<span>{task.text}</span>
				</li>
			{/each}
		</ul>

		<p class="mt-2 opacity-60">{percentComplete}% complete</p>
	</section>

	<section id="preview" class="mt-20 w-full p-6 rounded border-2 border-dashed border-gray-200/10">
		<!-- TODO: create safeMarkup and safeStyles reactive vars by sanitizing -->
		{@html `<style>${styles}</style>`}
		{@html data.markup}
	</section>
</div>
