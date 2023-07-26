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
			text: 'Increase the width of the snowballs to at 100px',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'width',
				propertyType: 'number',
				comparator: '==',
				value: '100px',
			},
		},
		{
			text: 'Use `aspect-ratio` to make all dimensions the same instead of using `height`',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'aspect-ratio',
				propertyType: 'number',
				comparator: '==',
				value: '1',
			},
		},
		{
			text: 'Give them a nice, fully-round `border-radius` at 50%',
			requirement: {
				type: 'property',
				selector: '.ball',
				property: 'border-radius',
				propertyType: 'number',
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
				propertyType: 'number',
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
					propertyType: 'number',
					comparator: '==',
					value: '100px',
				},
				{
					type: 'property',
					selector: '#ball-2',
					property: 'width',
					propertyType: 'number',
					comparator: '==',
					value: '130px',
				},
				{
					type: 'property',
					selector: '#ball-3',
					property: 'width',
					propertyType: 'number',
					comparator: '==',
					value: '170px',
				},
			],
		},
		{
			text: `The snowman is a little lop-sided now, so let's fix that by making #snowman a flex container as a column, and then using \`align-items: center\` to center the snowballs vertically`,
			requirement: [
				{
					type: 'property',
					selector: '#snowman',
					property: 'display',
					propertyType: 'literal',
					value: 'flex',
				},
				{
					type: 'property',
					selector: '#snowman',
					property: 'flex-direction',
					propertyType: 'literal',
					value: 'column',
				},
				{
					type: 'property',
					selector: '#snowman',
					property: 'align-items',
					propertyType: 'literal',
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
