import DOMPurify from 'isomorphic-dompurify';
import previewCssReset from '$lib/styles/preview-css-reset.css?inline';

export const CONTAINER_ID = 'preview-container';

/**
 * Content Strategy
 *
 * To avoid recreating the iframe on every code change (which happens if we update
 * srcdoc or if we use iframeDoc.write()) we instead utilize a container div inside
 * the iframe that we can update on every code change.
 */
interface UpdatePreviewContentArgs {
	frameDoc: Document;
	markup: string;
	styles: string;
}
export async function updatePreviewContent({ frameDoc, markup, styles }: UpdatePreviewContentArgs) {
	const doc = frameDoc as Document;
	const safeStyles = DOMPurify.sanitize(styles);

	// container isn't created on first-load
	let container = doc.getElementById(CONTAINER_ID);
	if (!container) {
		const newContainer = doc.createElement('div');
		newContainer.id = CONTAINER_ID;
		doc.body.appendChild(newContainer);
		container = newContainer;
	}

	const code = `
        <style>${previewCssReset}</style>
        <style id="user-styles">${safeStyles}</style>

        ${markup}
    `;
	container.innerHTML = code;
}
