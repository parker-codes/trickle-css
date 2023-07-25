import type { RequirementOrSet } from './requirement';

export interface Task {
	text: string;
	requirement: RequirementOrSet;
}

export interface VerifiedTask extends Task {
	completed: boolean;
}

export function getPercentCompleted(tasks: VerifiedTask[]): number {
	if (tasks.length === 0) return 0;
	return Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100);
}
