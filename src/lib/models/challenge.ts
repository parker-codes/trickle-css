import type { Task } from './task';

export interface Challenge {
	title: string;
	slug: string;
	// TODO: add difficulty rating
	startingStyles: string;
	markup: string;
	tasks: Task[];
}
