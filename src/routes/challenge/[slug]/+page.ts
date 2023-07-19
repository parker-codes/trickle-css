import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Challenge } from '$lib/models/challenge';

const challenges: Challenge[] = Object.values(
	import.meta.glob('$lib/challenges/*.ts', { eager: true, import: 'default' })
);

export const load = (({ params }) => {
	const challenge = challenges.find((challenge) => challenge.slug === params.slug);
	if (challenge) return challenge;
	else throw error(404, 'Challenge not found');
}) satisfies PageLoad<Challenge>;
