export default {
	title: '🃁️ Animated Gradient Border',
	slug: 'animated-gradient-border-card',
	intro: `Plain old borders are boring. Let's make them more interesting by adding a gradient border with a pleasing animation!`,
	startingStyles: `
#card {
}
`,
	markup: `
<div id="card">🔷</div>

<style>
#preview-container {
  padding: 1rem; /* to give space for the border */
}

/*
  Support an animatable --rotation property to
  use in the background image
*/
@property --rotation {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@keyframes spin {
  100% {
	--rotation: 360deg;
  }
}
</style>
	`,
	tasks: [
		// {
		// 	text: `Set the background color of #chessboard to #000 as our base color`,
		// 	requirement: {
		// 		selector: '#chessboard',
		// 		property: 'background-color',
		// 		type: 'literal',
		// 		source: 'exact',
		// 		value: 'rgb(0, 0, 0)',
		// 	},
		// },
	],
};

/**
 *  Possible Solution

	#card {
		position: relative;
		width: 300px;
		aspect-ratio: 2/3;

		border-radius: 8px;
		background-color: #111827;

		display: grid;
		place-items: center;
		font-size: 4rem;
	}

	#card:before {
		position: absolute;
		inset: -0.3rem;
		content: "";
		z-index: -1;

		border-radius: 12px;
		background-image: linear-gradient(
			var(--rotation),
			#5ddcff,
			#3c67e3 43%,
			#4e00c2
		);
		animation: spin 2.5s linear infinite;
	}
 */
