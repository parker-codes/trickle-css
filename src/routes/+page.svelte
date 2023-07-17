<script lang="ts">
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import { css } from '@codemirror/lang-css';
	import { oneDark } from "@codemirror/theme-one-dark";

	let code = '';
</script>

<h1 class="text-4xl font-bold dark:text-slate-50 mx-4 my-8 text-center">Style By Number</h1>

<section id="editor" class="mt-20 mx-8">
	<CodeMirror bind:value={code} lang={css()} theme={oneDark} />
</section>
