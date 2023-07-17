<script lang="ts">
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import { css } from '@codemirror/lang-css';

	let code = '';
</script>

<CodeMirror bind:value={code} lang={css()} />
