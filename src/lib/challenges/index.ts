import type { Challenge } from '$lib/models/challenge';

export const challenges: Challenge[] = Object.values(
	import.meta.glob(['./*.ts', './index.ts'], { eager: true, import: 'default' })
);
