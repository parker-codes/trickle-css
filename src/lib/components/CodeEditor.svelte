<script lang="ts" context="module">
	export type ThemeSpec = Record<string, StyleSpec>;
	export type StyleSpec = {
		[propOrSelector: string]: string | number | StyleSpec | null;
	};
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap, placeholder as placeholderExt } from '@codemirror/view';
	import { EditorState, StateEffect, type Extension } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit, type LanguageSupport } from '@codemirror/language';
	import { debounce } from '../utils/misc';

	let classes = '';
	export { classes as class };
	export let value: string | null | undefined = '';

	export let basic = true;
	export let lang: LanguageSupport | null | undefined = undefined;
	export let langLabel: 'HTML' | 'CSS';
	export let theme: Extension | null | undefined = undefined;
	export let extensions: Extension[] = [];

	export let useTab = true;
	export let tabSize = 2;

	export let styles: ThemeSpec | null | undefined = undefined;
	export let lineWrapping = false;
	export let editable = true;
	export let readonly = false;
	export let placeholder: string | HTMLElement | null | undefined = undefined;

	const is_browser = typeof window !== 'undefined';
	const dispatch = createEventDispatcher<{ change: string }>();

	let element: HTMLDivElement;
	let view: EditorView;

	let update_from_prop = false;
	let update_from_state = false;
	let first_config = true;
	let first_update = true;

	$: state_extensions = [
		...get_base_extensions(
			basic,
			useTab,
			tabSize,
			lineWrapping,
			placeholder,
			editable,
			readonly,
			lang
		),
		...get_theme(theme, styles),
		...extensions,
	];

	$: view && update(value);
	$: view && state_extensions && reconfigure();

	onMount(() => (view = create_editor_view()));
	onDestroy(() => view?.destroy());

	function create_editor_view(): EditorView {
		const on_change = debounce(handle_change, 300);

		return new EditorView({
			parent: element,
			state: create_editor_state(value),
			dispatch(transaction) {
				view.update([transaction]);

				if (!update_from_prop && transaction.docChanged) {
					on_change();
				}
			},
		});
	}

	function reconfigure(): void {
		if (first_config) {
			first_config = false;
			return;
		}

		view.dispatch({
			effects: StateEffect.reconfigure.of(state_extensions),
		});
	}

	function update(value: string | null | undefined): void {
		if (first_update) {
			first_update = false;
			return;
		}

		if (update_from_state) {
			update_from_state = false;
			return;
		}

		update_from_prop = true;

		view.setState(create_editor_state(value));

		update_from_prop = false;
	}

	function handle_change(): void {
		const new_value = view.state.doc.toString();
		if (new_value === value) return;

		update_from_state = true;

		value = new_value;
		dispatch('change', value);
	}

	function create_editor_state(value: string | null | undefined): EditorState {
		return EditorState.create({
			doc: value ?? undefined,
			extensions: state_extensions,
		});
	}

	function get_base_extensions(
		basic: boolean,
		useTab: boolean,
		tabSize: number,
		lineWrapping: boolean,
		placeholder: string | HTMLElement | null | undefined,
		editable: boolean,
		readonly: boolean,
		lang: LanguageSupport | null | undefined
	): Extension[] {
		const extensions: Extension[] = [
			indentUnit.of(' '.repeat(tabSize)),
			EditorView.editable.of(editable),
			EditorState.readOnly.of(readonly),
		];

		if (basic) extensions.push(basicSetup);
		if (useTab) extensions.push(keymap.of([indentWithTab]));
		if (placeholder) extensions.push(placeholderExt(placeholder));
		if (lang) extensions.push(lang);
		if (lineWrapping) extensions.push(EditorView.lineWrapping);

		return extensions;
	}

	function get_theme(
		theme: Extension | null | undefined,
		styles: ThemeSpec | null | undefined
	): Extension[] {
		const extensions: Extension[] = [];
		if (styles) extensions.push(EditorView.theme(styles));
		if (theme) extensions.push(theme);
		return extensions;
	}

	export let collapsable = false;
	let collapsed = false;
</script>

{#if is_browser}
	<div class="codemirror-wrapper {classes}" class:collapsed bind:this={element}>
		<div class="collapse-cover" />

		<div class="code-tools">
			{#if collapsable}
				<button
					on:click={() => (collapsed = !collapsed)}
					class="collapse-button rounded px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white flex gap-1"
				>
					{#if collapsed}
						Expand
					{:else}
						Collapse
					{/if}
				</button>
			{/if}

			<div class="lang-label">{langLabel}</div>
		</div>
	</div>
{:else}
	<div class="scm-waiting {classes}">
		<div class="scm-waiting__loading scm-loading">
			<div class="scm-loading__spinner" />
			<p class="scm-loading__text">Loading editor...</p>
		</div>

		<pre class="scm-pre cm-editor">{value}</pre>
	</div>
{/if}

<style>
	.codemirror-wrapper {
		position: relative;
	}

	.codemirror-wrapper :global(.cm-editor) {
		max-height: var(--editor-max-height, 18rem);
		overflow-y: auto;
	}
	.codemirror-wrapper.collapsed :global(.cm-editor) {
		max-height: 1.6rem;
	}
	.codemirror-wrapper.collapsed .collapse-cover {
		position: absolute;
		inset: 0;
		z-index: 1;
		background-color: #334155;
	}

	.code-tools {
		position: absolute;
		inset: 0.15rem 0.25rem auto auto;
		z-index: 1;

		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}
	.collapse-button {
		padding: 0.1rem 0.3rem;
		font-size: 0.7rem;
		letter-spacing: 0.02em;
	}
	.lang-label {
		padding: 0.1rem 0.3rem;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.7rem;
		letter-spacing: 0.02em;
	}

	.codemirror-wrapper :global(.cm-editor) {
		font-size: 0.9rem;
		font-family: monospace;
	}

	.codemirror-wrapper :global(.cm-focused) {
		outline: none;
	}

	.scm-waiting {
		position: relative;
	}
	.scm-waiting__loading {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.scm-loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scm-loading__spinner {
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		border: solid 2px #000;
		border-top-color: transparent;
		margin-right: 0.75rem;
		animation: spin 1s linear infinite;
	}
	.scm-loading__text {
		font-family: sans-serif;
	}
	.scm-pre {
		font-size: 1rem;
		font-family: monospace;
		tab-size: 2;
		-moz-tab-size: 2;
		resize: none;
		pointer-events: none;
		user-select: none;
		overflow: auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
