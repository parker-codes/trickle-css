import type { PageLoad } from './$types';
import type { Challenge } from '$lib/models/challenge';
import { challenges } from '$lib/data/challenges';

interface PageData {
	challenges: Challenge[];
}

export const load = (() => {
	return { challenges };
}) satisfies PageLoad<PageData>;
