<script lang="ts">
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
		<li>
			<span class="text-green-400">✓</span>
			Increase the width of the snowballs
		</li>
		<li>
			<span class="opacity-20">✓</span>
			Use `aspect-ratio` to make all dimensions the same instead of using `height`
		</li>
		<li>
			<span class="opacity-20">✓</span>
			Give them a nice, fully-round `border-radius`
		</li>
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
