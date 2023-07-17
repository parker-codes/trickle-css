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

<section id="preview" class="mt-20 mx-8">
	{@html `<style>${code}</style>`}

	<div id="snowman">
		<div id="ball-1" class="ball" />
		<div id="ball-2" class="ball" />
		<div id="ball-3" class="ball" />
	</div>
</section>
