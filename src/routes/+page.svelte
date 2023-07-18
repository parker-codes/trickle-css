<script lang="ts">
	import { tick } from 'svelte';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import { getPercentCompleted, type Task, type VerifiedTask } from '$lib/models/task';
	import { verify } from '$lib/models/requirement';

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

	const tasks: Task[] = [
		{
			text: 'Increase the width of the snowballs to at least 100px',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'width',
				comparator: '>=',
				value: '100px'
			}
		},
		{
			text: 'Use `aspect-ratio` to make all dimensions the same instead of using `height`',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'aspect-ratio',
				comparator: '==',
				value: '1'
			}
		},
		{
			text: 'Give them a nice, fully-round `border-radius`',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'border-radius',
				comparator: '==',
				value: '50%'
			}
		},
		{
			text: 'For good reusability, create a CSS variable for the base size called `--base-size` and set it to 100px',
			requirement: {
				type: 'variable',
				selector: '.ball',
				property: '--base-size',
				comparator: '==',
				value: '100px'
			}
		},
		{
			text: 'Now use that variable to set the width and height of #ball-1, and then multiply it by 1.3 for #ball-2 and 1.7 for #ball-3',
			requirement: [
				{
					type: 'property',
					selector: '#ball-1',
					property: 'width',
					comparator: '==',
					value: '100px'
				},
				{
					type: 'property',
					selector: '#ball-2',
					property: 'width',
					comparator: '==',
					value: '130px'
				},
				{
					type: 'property',
					selector: '#ball-3',
					property: 'width',
					comparator: '==',
					value: '170px'
				}
			]
		}
	];

	let verifiedTasks: VerifiedTask[] = [];
	$: verifyAll(styles);

	async function verifyAll(_code: string): Promise<void> {
		await tick(); // wait for styles to apply before checking

		verifiedTasks = tasks.map((task) => ({
			...task,
			completed: verify(task.requirement)
		}));
	}

	$: percentComplete = getPercentCompleted(verifiedTasks);
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
		{@html `<style>${styles}</style>`}

		{@html markup}
	</section>
</div>
