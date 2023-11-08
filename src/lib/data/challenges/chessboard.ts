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
				selector: '#chessboard',
				property: 'background-color',
				type: 'literal',
				source: 'exact',
				value: 'rgb(0, 0, 0)',
			},
		},
		{
			text: `Set the width of #chessboard to 100% and the aspect-ratio to 1 to make it square`,
			requirement: [
				{
					selector: '#chessboard',
					property: 'width',
					type: 'unit',
					source: 'exact',
					comparator: '==',
					value: '100%',
				},
				{
					selector: '#chessboard',
					property: 'aspect-ratio',
					type: 'literal',
					source: 'exact',
					value: '1 / 1',
				},
			],
		},
		{
			text: `Set the border of all <td> elements to 3px solid #9ca3af`,
			requirement: [
				{
					selector: 'td',
					property: 'border-width',
					type: 'unit',
					comparator: '==',
					value: '3px',
				},
				{
					selector: 'td',
					property: 'border-style',
					type: 'literal',
					value: 'solid',
				},
				{
					selector: 'td',
					property: 'border-color',
					type: 'literal',
					value: 'rgb(156, 163, 175)',
				},
			],
		},
		{
			text: `Let's get a little more complex! Set the background-color of every other square to #dc2626. You may be initially inclined to use the element IDs, but this is just a red herring - instead, craft your selector to target <td> elements. Do this by creating two selectors for the block - one for odd columns in odd rows and another for even columns in even rows. Use the \`nth-of-type\` selector to select the odd and even <tr> and <td> elements.`,
			requirement: [
				{
					selector: 'tr:nth-of-type(odd) td:nth-of-type(odd)',
					property: 'background-color',
					type: 'literal',
					value: 'rgb(220, 38, 38)',
				},
				{
					selector: 'tr:nth-of-type(even) td:nth-of-type(even)',
					property: 'background-color',
					type: 'literal',
					value: 'rgb(220, 38, 38)',
				},
				// TODO: check that opposites are still good?
			],
		},
		{
			text: `Lastly, rotate the board to see a different perspective! \`rotate3d(5, 0, 1, 45deg)\``,
			requirement: {
				selector: '#chessboard',
				property: 'transform',
				type: 'literal',
				source: 'exact',
				value: 'rotate3d(5, 0, 1, 45deg)',
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
