import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Canvas } from '$lib/models/canvas';

export const load = (({ params }) => {
	const canvas = canvases.find((canvas) => canvas.slug === params.slug);
	if (canvas) return canvas;
	else throw error(404, 'Not found');
}) satisfies PageLoad<Canvas>;

const canvases: Canvas[] = [
	{
		title: 'Snowman',
		slug: 'snowman',
		startingStyles: `
.ball {
  width: 10px;
  height: 10px;
  background-color: #fff;
}
`,
		markup: `
<div id="snowman">
	<div id="ball-1" class="ball"></div>
	<div id="ball-2" class="ball"></div>
	<div id="ball-3" class="ball"></div>
</div>
`,
		tasks: [
			{
				text: 'Increase the width of the snowballs to at least 100px',
				requirement: {
					type: 'property',
					selector: '.ball',
					property: 'width',
					comparator: '>=',
					value: '100px',
				},
			},
			{
				text: 'Use `aspect-ratio` to make all dimensions the same instead of using `height`',
				requirement: {
					type: 'property',
					selector: '.ball',
					property: 'aspect-ratio',
					comparator: '==',
					value: '1',
				},
			},
			{
				text: 'Give them a nice, fully-round `border-radius`',
				requirement: {
					type: 'property',
					selector: '.ball',
					property: 'border-radius',
					comparator: '==',
					value: '50%',
				},
			},
			{
				text: 'For good reusability, create a CSS variable for the base size called `--base-size` and set it to 100px',
				requirement: {
					type: 'variable',
					selector: '.ball',
					property: '--base-size',
					comparator: '==',
					value: '100px',
				},
			},
			{
				text: 'Now use that variable to set the width and height of #ball-1, and then multiply it by 1.3 for #ball-2 and 1.7 for #ball-3',
				requirement: [
					{
						type: 'property',
						selector: '#ball-1',
						property: 'width',
						comparator: '==',
						value: '100px',
					},
					{
						type: 'property',
						selector: '#ball-2',
						property: 'width',
						comparator: '==',
						value: '130px',
					},
					{
						type: 'property',
						selector: '#ball-3',
						property: 'width',
						comparator: '==',
						value: '170px',
					},
				],
			},
		],
	},
];
