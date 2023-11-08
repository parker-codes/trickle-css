export default {
	title: '⛄️ Snowman',
	slug: 'snowman',
	intro: 'Style the three balls to look like a snowman.',
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
				selector: '.ball',
				property: 'width',
				type: 'unit',
				source: 'exact',
				comparator: '>=',
				value: '100px',
			},
		},
		{
			text: 'Use `aspect-ratio` to make all dimensions the same instead of using `height`',
			requirement: {
				selector: '.ball',
				property: 'aspect-ratio',
				type: 'unit',
				source: 'exact',
				comparator: '==',
				value: '1 / 1',
			},
		},
		{
			text: 'Give them a nice, fully-round `border-radius` at 50%',
			requirement: {
				selector: '.ball',
				property: 'border-radius',
				type: 'unit',
				source: 'exact',
				comparator: '==',
				value: '50%',
			},
		},
		{
			text: 'For good reusability, create a CSS variable for the base size called `--base-size` and set it to 100px',
			requirement: {
				selector: '.ball',
				property: '--base-size',
				type: 'unit',
				source: 'exact',
				comparator: '==',
				value: '100px',
			},
		},
		{
			text: 'Now use that variable to set the width of #ball-1, and then use calc() to multiply it by 1.3 for #ball-2 and 1.7 for #ball-3',
			requirement: [
				{
					selector: '#ball-1',
					property: 'width',
					type: 'unit',
					source: 'exact',
					comparator: '==',
					value: '100px',
				},
				{
					selector: '#ball-2',
					property: 'width',
					type: 'unit',
					source: 'exact',
					comparator: '==',
					value: '130px',
				},
				{
					selector: '#ball-3',
					property: 'width',
					type: 'unit',
					source: 'exact',
					comparator: '==',
					value: '170px',
				},
			],
		},
		{
			text: `The snowman is a little lop-sided now, so let's fix that by making #snowman a flex container as a column, and then using \`align-items: center\` to center the snowballs vertically`,
			requirement: [
				{
					selector: '#snowman',
					property: 'display',
					type: 'literal',
					value: 'flex',
				},
				{
					selector: '#snowman',
					property: 'flex-direction',
					type: 'literal',
					value: 'column',
				},
				{
					selector: '#snowman',
					property: 'align-items',
					type: 'literal',
					value: 'center',
				},
			],
		},
	],
};

/**
 *  Possible Solution

	#snowman {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ball {
		--base-size: 100px;

		width: var(--base-size);
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: #fff;
	}

	#ball-2 {
		width: calc(var(--base-size) * 1.3);
	}

	#ball-3 {
		width: calc(var(--base-size) * 1.7);
	}
 */
