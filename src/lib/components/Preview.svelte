<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { CONTAINER_ID } from '$lib/models/preview';

	export let iframeHeight: number;
	let iframe: HTMLIFrameElement;

	const dispatch = createEventDispatcher<{ load: Document }>();

	onMount(() => {
		if (iframe?.contentDocument?.readyState === 'complete') {
			onIframeLoad();
		} else {
			iframe.addEventListener('load', onIframeLoad);
		}

		return () => {
			iframe.removeEventListener('load', onIframeLoad);
		};
	});
	async function onIframeLoad() {
		dispatch('load', iframe?.contentDocument as Document);
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
