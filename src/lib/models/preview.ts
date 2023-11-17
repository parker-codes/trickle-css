import DOMPurify from 'isomorphic-dompurify';
import previewCssReset from '$lib/styles/preview-css-reset.css?inline';

export const CONTAINER_ID = 'preview-container';

let updating = false;

/**
 * Content Strategy
 *
 * To avoid recreating the iframe on every code change (which happens if we update
 * srcdoc or if we use iframeDoc.write()) we instead utilize a container div inside
 * the iframe that we can destroy and recreate on every code change.
 */
interface UpdatePreviewContentArgs {
	frameDoc: Document;
	markup: string;
	styles: string;
}
export async function updatePreviewContent({ frameDoc, markup, styles }: UpdatePreviewContentArgs) {
	if (updating) return;
	updating = true;

	const doc = frameDoc as Document;
	const safeStyles = DOMPurify.sanitize(styles);

	// TODO: figure out why the container is null on first load!!
	const container = doc.getElementById(CONTAINER_ID);
	console.log('container', container);
	if (!container) {
		await waitFor(1000);
		const container2 = doc.getElementById(CONTAINER_ID);
		console.log('container2', container2);
	}
	if (!container) return;

	while (container.firstChild) container.removeChild(container.firstChild);

	const code = `
        <style>${previewCssReset}</style>
        <style id="user-styles">${safeStyles}</style>

        ${markup}
    `;

	console.log('updating preview content');

	const newElement = doc.createElement('div');
	newElement.innerHTML = code;
	container.appendChild(newElement);

	updating = false;
}

async function waitFor(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
