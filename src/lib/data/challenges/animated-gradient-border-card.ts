export default {
	title: '🃁️ Animated Gradient Border',
	slug: 'animated-gradient-border-card',
	intro: `Plain old borders are boring. Let's make them more interesting by adding a gradient border with a pleasing animation! There are many ways to create this kind of border, but the approach we'll take today is to use a pseudo-element to create a border that extends beyond the container, and then animate that pseudo-element. Note that the animation part of this challenge is not supported in Firefox yet, but the border will still render.`,
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
		{
			text: `Set the width of #card to at least 200px`,
			requirement: {
				selector: '#card',
				property: 'width',
				type: 'unit',
				comparator: '>=',
				value: '200px',
			},
		},
		{
			text: `Set the aspect ratio of the card to 2:3`,
			requirement: {
				selector: '#card',
				property: 'aspect-ratio',
				type: 'literal',
				source: 'exact',
				value: '2 / 3',
			},
		},
		{
			text: `Let's curve the corners of the card by setting the border-radius to 8px`,
			requirement: {
				selector: '#card',
				property: 'border-radius',
				type: 'unit',
				source: 'exact',
				value: '8px',
			},
		},
		{
			text: `Set the background color of #card to #111827`,
			requirement: {
				selector: '#card',
				property: 'background-color',
				type: 'literal',
				source: 'computed',
				value: 'rgb(17, 24, 39)',
			},
		},
		{
			text: `To put the diamond in the center of the card, set the display to grid and place-items to center. (How easy was that to center something?!))`,
			requirement: [
				{
					selector: '#card',
					property: 'display',
					type: 'literal',
					source: 'exact',
					value: 'grid',
				},
				{
					selector: '#card',
					property: 'place-items',
					type: 'literal',
					source: 'exact',
					value: 'center',
				},
			],
		},
		{
			text: 'Then set the font-size to 4rem.',
			requirement: {
				selector: '#card',
				property: 'font-size',
				type: 'unit',
				source: 'exact',
				value: '4rem',
			},
		},
		{
			text: `Now let's add the border! Give the card a card relative positioning. Target the card's :before pseudo-element and set the position to absolute.`,
			requirement: [
				{
					selector: '#card',
					property: 'position',
					type: 'literal',
					source: 'exact',
					value: 'relative',
				},
				{
					selector: '#card',
					pseudoSelector: '::before',
					property: 'position',
					type: 'literal',
					source: 'computed',
					value: 'absolute',
				},
			],
		},
		{
			text: `Then set the inset to -0.3rem to make the border extend beyond the card.`,
			requirement: {
				selector: '#card',
				pseudoSelector: '::before',
				property: 'inset',
				type: 'unit',
				comparator: '<=',
				source: 'computed',
				value: '-0.3rem',
			},
		},
		{
			text: `Set the content to an empty string to make the pseudo-element visible. For now, set the background color to anything you want so you can see it.`,
			requirement: {
				selector: '#card',
				pseudoSelector: '::before',
				property: 'content',
				type: 'literal',
				source: 'computed',
				value: '""',
			},
		},
		{
			text: `Set the z-index to -1 to make sure the pseudo-element is behind the card.`,
			requirement: {
				selector: '#card',
				pseudoSelector: '::before',
				property: 'z-index',
				type: 'literal',
				source: 'computed',
				value: '-1',
			},
		},
		{
			text: `Now that we've got a border, let's curve the edges to match the curvature of the card. Set the border radius to 12px on the pseudo-element.`,
			requirement: {
				selector: '#card',
				pseudoSelector: '::before',
				property: 'border-radius',
				type: 'unit',
				source: 'exact',
				value: '12px',
			},
		},
		{
			text: `Let's get fancy! Remove the background color of the psudo-element and set the background image to a linear gradient that goes from #5ddcff to #3c67e3 to #4e00c2. Set the rotation to 'var(--rotation)' (pre-defined in markup) so we can animate it later. Note that in Firefox @property declarations are not yet supported, so you can use '0deg' instead and the border will not animate.`,
			requirement: {
				selector: '#card',
				pseudoSelector: '::before',
				property: 'background-image',
				type: 'literal',
				source: 'computed',
				value: 'linear-gradient(0deg, rgb(93, 220, 255), rgb(60, 103, 227) 43%, rgb(78, 0, 194))',
			},
		},
		{
			text: `To finish it off, set the animation to 'spin' (pre-defined in markup) infinitely at an interval of at least 2.5s.`,
			requirement: [
				{
					selector: '#card',
					pseudoSelector: '::before',
					property: 'animation-name',
					type: 'literal',
					source: 'computed',
					value: 'spin',
				},
				{
					selector: '#card',
					pseudoSelector: '::before',
					property: 'animation-iteration-count',
					type: 'literal',
					source: 'computed',
					value: 'infinite',
				},
				{
					selector: '#card',
					pseudoSelector: '::before',
					property: 'animation-duration',
					type: 'unit',
					comparator: '>=',
					source: 'computed',
					value: '2.5s',
				},
			],
		},
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
