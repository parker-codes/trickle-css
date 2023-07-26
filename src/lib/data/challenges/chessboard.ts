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
	intro: `Let's make a chessboard!`,
	startingStyles: `
#chessboard {
  width: 100%;
  aspect-ratio: 1;
  background-color: #000;
  transform: rotate3d(5, 0, 1, 45deg);
}

table,th,td {
  border: 3px solid #9ca3af;
}

tr:nth-of-type(odd) td:nth-of-type(odd) {
  background-color: #dc2626;
}

tr:nth-of-type(even) td:nth-of-type(even) {
  background-color: #dc2626;
}
`,
	markup: makeBoard(),
	tasks: [],
};
