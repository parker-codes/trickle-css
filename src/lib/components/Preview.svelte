<script lang="ts">
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import DOMPurify from 'isomorphic-dompurify';
	import previewCssReset from '$lib/styles/preview-css-reset.css?inline';

	export let styles: string;
	export let markup: string;

	let iframe: HTMLIFrameElement;
	// TODO: heavily debounce
	let iframeHeight: number; // set on iframe load and reactively
	$: computeIframeHeight(safeStyles);

	async function computeIframeHeight(_styles?: string): Promise<void> {
		await tick(); // wait for styles to apply before checking
		if (!browser || !iframe) return;
		iframeHeight = iframe.contentWindow?.document.body.scrollHeight || 0;
	}

	/**
	 * Sanitization
	 */

	$: safeStyles = DOMPurify.sanitize(styles);
	$: safeMarkup = DOMPurify.sanitize(markup);

	// TODO: debounce updates to iframe
	$: code = `
        <style>${previewCssReset}</style>
        <style>${safeStyles}</style>

        ${safeMarkup}
    `;
</script>

<!-- TODO: use a CSP to allow inline styles and no scripts -->
<!-- TODO: use the sandbox property -->
<iframe
	bind:this={iframe}
	on:load={() => computeIframeHeight()}
	srcdoc={code}
	class="relative w-full border-none"
	height={iframeHeight}
	frameborder="0"
	scrolling="no"
	title="Challenge preview"
/>
