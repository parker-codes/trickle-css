import type { Task } from './task';
import { browser } from '$app/environment';

export interface Challenge {
	title: string;
	slug: string;
	intro: string;
	// TODO: add difficulty rating
	startingStyles: string;
	markup: string;
	tasks: Task[];
}

function buildChallengeStylesStorageKey(slug: string): string {
	return `challenge-${slug}:styles`;
}

export function getSavedChallengeStyles(slug: string): string | null {
	if (!browser) return null;
	return window.localStorage.getItem(buildChallengeStylesStorageKey(slug));
}

export function saveChallengeStyles(slug: string, styles: string): void {
	if (!browser) return;
	window.localStorage.setItem(buildChallengeStylesStorageKey(slug), styles);
}

export function clearSavedChallengeStyles(slug: string): void {
	if (!browser) return;
	window.localStorage.removeItem(buildChallengeStylesStorageKey(slug));
}
