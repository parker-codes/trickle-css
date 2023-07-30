<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import DOMPurify from 'isomorphic-dompurify';
	import previewCssReset from '$lib/styles/preview-css-reset.css?inline';

	export let styles: string;
	export let markup: string;

	let iframe: HTMLIFrameElement;
	export let frameDoc: Document | null = null; // passed up to parent to use in requirement verification

	onMount(() => {
		frameDoc = iframe?.contentDocument;
		if (frameDoc) computeIframeHeight();
	});

	let iframeHeight: number; // set on mount and reactively
	$: computeIframeHeight(safeStyles);

	// TODO: heavily debounce
	async function computeIframeHeight(_styles?: string): Promise<void> {
		await tick(); // wait for styles to apply before checking
		if (!browser || !frameDoc) return;
		iframeHeight = frameDoc?.body.scrollHeight || 0;
	}

	/**
	 * Sanitization
	 */

	$: safeStyles = DOMPurify.sanitize(styles);
	$: safeMarkup = DOMPurify.sanitize(markup);

	// TODO: debounce updates to iframe

	/**
	 * Content Strategy
	 *
	 * To avoid recreating the iframe on every code change (which happens if we update
	 * srcdoc or if we use iframeDoc.write()) we instead utilize a container div inside
	 * the iframe that we can destroy and recreate on every code change.
	 */
	const CONTAINER_ID = 'preview-container';
	$: overwriteContainerContent(safeStyles);
	function overwriteContainerContent(_styles: string): void {
		const doc = iframe?.contentDocument;
		if (!doc) return;

		const container = doc.getElementById(CONTAINER_ID);
		if (!container) return;

		while (container.firstChild) container.removeChild(container.firstChild);

		const code = `
			<style>${previewCssReset}</style>
			<style>${safeStyles}</style>

			${safeMarkup}
		`;

		const newElement = doc.createElement('div');
		newElement.innerHTML = code;
		container.appendChild(newElement);
	}
</script>

<!-- TODO: use a CSP to allow inline styles and no scripts -->
<!-- TODO: use the sandbox property -->
<iframe
	bind:this={iframe}
	srcdoc="<div id='{CONTAINER_ID}'></div>"
	class="relative w-full border-none"
	height={iframeHeight}
	frameborder="0"
	scrolling="no"
	title="Challenge preview"
/>
