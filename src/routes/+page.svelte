<script lang="ts">
	import { tick } from 'svelte';
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';

	let styles = `
.ball {
  width: 10px;
  height: 10px;
  background-color: #fff;
}
	`;

	const markup = `
<div id="snowman">
	<div id="ball-1" class="ball"></div>
	<div id="ball-2" class="ball"></div>
	<div id="ball-3" class="ball"></div>
</div>
	`;

	type RequirementType = 'property' | 'variable';
	type Comparator = '>' | '>=' | '<' | '<=' | '==' | '!=';

	interface Requirement {
		type: RequirementType;
		selector: string;
		property: string;
		comparator: Comparator;
		value: string;
	}

	interface Task {
		text: string;
		requirement: Requirement;
		completed: boolean;
	}

	let tasks: Task[] = [
		{
			text: 'Increase the width of the snowballs to at least 100px',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'width',
				comparator: '>=',
				value: '100px'
			},
			completed: false
		},
		{
			text: 'Use `aspect-ratio` to make all dimensions the same instead of using `height`',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'aspect-ratio',
				comparator: '==',
				value: '1'
			},
			completed: false
		},
		{
			text: 'Give them a nice, fully-round `border-radius`',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'border-radius',
				comparator: '==',
				value: '50%'
			},
			completed: false
		},
		{
			text: 'For good reusability, create a CSS variable for the base size called `--base-size` and set it to 100px',
			requirement: {
				type: 'variable',
				selector: '.ball',
				property: '--base-size',
				comparator: '==',
				value: '100px'
			},
			completed: false
		}
	];

	$: verifyAll(styles);

	async function verifyAll(_code: string): Promise<void> {
		await tick(); // wait for styles to apply before checking

		tasks = tasks.map((task) => {
			task.completed = verify(task.requirement);
			return task;
		});
	}

	function verify(requirement: Requirement): boolean {
		console.log('verifying requirement', requirement);

		// server-side check
		if (typeof window === 'undefined') return false;

		// TODO: could also parse the code var itself instead of inspecting the DOM
		const el = document.querySelector(requirement.selector);
		if (!el) return false;
		const style = window.getComputedStyle(el);

		// this works for both properties and variables
		const value = style.getPropertyValue(requirement.property);

		// TODO: need better parsing than only handling numbers
		const actual = parseInt(value, 10);
		const expected = parseInt(requirement.value, 10);

		console.log({ actual, expected });

		switch (requirement.comparator) {
			case '>':
				return actual > expected;
			case '>=':
				return actual >= expected;
			case '<':
				return actual < expected;
			case '<=':
				return actual <= expected;
			case '==':
				return actual === expected;
			case '!=':
				return actual !== expected;
			default:
				return false;
		}
	}

	$: percentComplete = Math.round(
		(tasks.filter((task) => task.completed).length / tasks.length) * 100
	);
</script>

<div class="max-w-6xl mx-auto">
	<h1 class="text-4xl font-bold mx-4 my-8">
		<div class="mx-auto w-fit pt-4 border-t-2 border-t-green-300">Style By Number</div>
	</h1>

	<section id="editors" class="mt-20 flex justify-between gap-x-4">
		<CodeMirror
			bind:value={styles}
			lang={css()}
			theme={oneDark}
			class="flex-auto rounded overflow-clip"
		/>
		<CodeMirror
			value={markup}
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
			{#each tasks as task}
				<li>
					<span class={task.completed ? 'text-green-400' : 'opacity-20'}>✓</span>
					<span>{task.text}</span>
				</li>
			{/each}
		</ul>

		<p class="mt-2 opacity-60">{percentComplete}% complete</p>
	</section>

	<section id="preview" class="mt-20 w-full p-6 rounded border-2 border-dashed border-gray-200/10">
		{@html `<style>${styles}</style>`}

		{@html markup}
	</section>
</div>
