<script lang="ts">
	import { tick } from 'svelte';
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import { css } from '@codemirror/lang-css';
	import { oneDark } from '@codemirror/theme-one-dark';

	let code = `
.ball {
  width: 10px;
  height: 10px;
  background-color: #fff;
}
	`;

	type Comparator = '>' | '>=' | '<' | '<=' | '==' | '!=';

	interface Requirement {
		selector: string;
		property: string;
		comparator: Comparator;
		value: string;
	}

	interface Instruction {
		text: string;
		requirement: Requirement;
		completed: boolean;
	}

	let instructions: Instruction[] = [
		{
			text: 'Increase the width of the snowballs to at least 100px',
			requirement: {
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
				selector: '.ball',
				property: 'border-radius',
				comparator: '==',
				value: '50%'
			},
			completed: false
		}
	];

	$: verifyAll(code);

	async function verifyAll(code: string): Promise<void> {
		await tick();

		instructions = instructions.map((instruction) => {
			return {
				...instruction,
				completed: verify(instruction.requirement)
			};
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
</script>

<h1 class="text-4xl font-bold mx-4 my-8 text-center">Style By Number</h1>

<section id="editor" class="mt-20 mx-8">
	<CodeMirror bind:value={code} lang={css()} theme={oneDark} />
</section>

<section id="instructions" class="mt-20 mx-8">
	<h2 class="text-2xl font-bold mb-4">Instructions</h2>
	<p>
		Using the <code class="text-slate-50">.ball</code> class, style the three balls to look like a snowman.
	</p>

	<ul class="mt-4">
		{#each instructions as instruction}
			<li>
				<span class={instruction.completed ? 'text-green-400' : 'opacity-20'}>✓</span>
				<span>{instruction.text}</span>
			</li>
		{/each}
	</ul>
</section>

<section id="preview" class="mt-20 mx-8">
	{@html `<style>${code}</style>`}

	<div id="snowman">
		<div id="ball-1" class="ball" />
		<div id="ball-2" class="ball" />
		<div id="ball-3" class="ball" />
	</div>
</section>
