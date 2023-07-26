function makeSquare(number: number): string {
	const letter = String.fromCharCode(97 + (number % 8));
	return `    <td id="square-${letter}"></td>`;
}

function makeRow(number: number): string {
	const squares = [...Array(8).keys()].map(makeSquare).join('\n');

	return `  <tr id="row-${number + 1}">
${squares}
  </tr>`;
}

function makeBoard(): string {
	const rows = [...Array(8).keys()].reverse().map(makeRow).join('\n');

	return `
<table id="chessboard">
${rows}
</table>
`;
}

export default {
	title: '♖️ Chessboard',
	slug: 'chessboard',
	intro: `Let's turn a boring <table> into a fancy chessboard! In this challenge we'll cover the nth-of-type selector to make it easy to style every other square.`,
	startingStyles: `
#chessboard {
}
`,
	markup: makeBoard(),
	tasks: [
		{
			text: `Set the background color of #chessboard to #000 as our base color`,
			requirement: {
				type: 'property',
				selector: '#chessboard',
				property: 'background-color',
				propertyType: 'literal',
				value: 'rgb(0, 0, 0)',
			},
		},
		{
			text: `Set the width of #chessboard to 100% and the aspect-ratio to 1 to make it square`,
			requirement: [
				{
					type: 'property',
					selector: '#chessboard',
					property: 'width',
					propertyType: 'literal',
					// TODO: looks like with parsing gets the px value, so I'll need to compute and check if it's correct?
					value: '100%',
				},
				{
					type: 'property',
					selector: '#chessboard',
					property: 'aspect-ratio',
					propertyType: 'literal',
					value: '1',
				},
			],
		},
		{
			text: `Set the border of all <td> elements to 3px solid #9ca3af`,
			requirement: [
				{
					type: 'property',
					selector: 'td',
					property: 'border-width',
					propertyType: 'number',
					comparator: '>=',
					value: '2.4',
				},
				{
					type: 'property',
					selector: 'td',
					property: 'border-style',
					propertyType: 'literal',
					value: 'solid',
				},
				{
					type: 'property',
					selector: 'td',
					property: 'border-color',
					propertyType: 'literal',
					value: 'rgb(156, 163, 175)',
				},
			],
		},
		{
			text: `Let's get a little more complex! Set the background-color of every other square to #dc2626. You may be initially inclined to use the element IDs, but this is just a red herring - instead, craft your selector to target <td> elements. Do this by creating two selectors for the block - one for odd columns in odd rows and another for even columns in even rows. Use the \`nth-of-type\` selector to select the odd and even <tr> and <td> elements.`,
			requirement: [
				{
					type: 'property',
					selector: 'tr:nth-of-type(odd) td:nth-of-type(odd)',
					property: 'background-color',
					propertyType: 'literal',
					value: 'rgb(220, 38, 38)',
				},
				{
					type: 'property',
					selector: 'tr:nth-of-type(even) td:nth-of-type(even)',
					property: 'background-color',
					propertyType: 'literal',
					value: 'rgb(220, 38, 38)',
				},
				// TODO: check that opposites are still good?
			],
		},
		{
			text: `Lastly, rotate the board to see a different perspective! \`rotate3d(5, 0, 1, 45deg)\``,
			requirement: {
				type: 'property',
				selector: '#chessboard',
				property: 'transform',
				propertyType: 'literal',
				// TODO: this is a crazy difference in values - how can we better check this?
				value:
					'matrix3d(0.988735, 0.138675, 0.0563256, 0, -0.138675, 0.707107, 0.693375, 0, 0.0563256, -0.693375, 0.718372, 0, 0, 0, 0, 1)',
			},
		},
	],
};

/**
 *  Possible Solution

	#chessboard {
		width: 100%;
		aspect-ratio: 1;
		background-color: #000;
		transform: rotate3d(5, 0, 1, 45deg);
	}

	td {
		border: 3px solid #9ca3af;
	}

	tr:nth-of-type(odd) td:nth-of-type(odd),
	tr:nth-of-type(even) td:nth-of-type(even) {
		background-color: #dc2626;
	}
 */
