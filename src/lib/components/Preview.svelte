<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

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

<iframe
	bind:this={iframe}
	sandbox="allow-same-origin"
	class="relative w-full border-none"
	height={iframeHeight}
	frameborder="0"
	scrolling="no"
	title="Challenge preview"
/>
