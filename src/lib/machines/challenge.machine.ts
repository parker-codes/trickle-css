import { assign, createMachine } from 'xstate';
import {
	getSavedChallengeStyles,
	saveChallengeStyles,
	clearSavedChallengeStyles,
	type Challenge,
} from '$lib/models/challenge';
import { verify } from '$lib/models/requirement';
import type { VerifiedTask } from '$lib/models/task';
import { updatePreviewContent } from '$lib/models/preview';

interface ChallengeContext {
	frameDoc?: Document;
	previewHeight: number;
	challenge?: Challenge;
	verifiedTasks: VerifiedTask[];
	styles: string;
}

type ChallengeEvent =
	| { type: 'PREVIEW_FRAME_READY'; frameDoc: Document; challenge: Challenge }
	| { type: 'STYLES_CHANGED'; value: string }
	| { type: 'RESET_STYLES' };

type ChallengeService = {
	fetchSavedStyles: { data: string };
};

export const challengeMachine = createMachine(
	{
		id: 'challenge',
		initial: 'waitingForInit',
		preserveActionOrder: true,
		predictableActionArguments: true,
		schema: {
			context: {} as ChallengeContext,
			events: {} as ChallengeEvent,
			services: {} as ChallengeService,
		},
		tsTypes: {} as import('./challenge.machine.typegen').Typegen0,

		context: {
			frameDoc: undefined,
			previewHeight: 0,
			challenge: undefined,
			verifiedTasks: [],
			styles: '',
		},

		states: {
			waitingForInit: {
				on: {
					PREVIEW_FRAME_READY: {
						actions: ['setInitialData'],
						target: 'loadingData',
					},
				},
			},
			loadingData: {
				invoke: {
					src: 'fetchSavedStyles',
					onDone: {
						actions: ['initializeStyles'],
						target: 'active',
					},
				},
			},
			active: {
				type: 'parallel',
				states: {
					editing: {
						on: {
							RESET_STYLES: {
								actions: ['resetStyles', 'clearPersistedStyles'],
							},
							// TODO: debounce this
							STYLES_CHANGED: {
								actions: ['updateStyles', 'persistStyles'],
							},
						},
					},

					preview: {
						initial: 'firstLoad',
						states: {
							firstLoad: {
								// TODO: we need to run updating twice on first load to get the previewContentLoaded
								invoke: {
									src: 'updatePreviewContent',
									onDone: {
										target: 'updating',
									},
								},
							},
							idle: {
								on: {
									STYLES_CHANGED: 'updating',
								},
							},
							updating: {
								invoke: {
									src: 'updatePreviewContent',
									onDone: {
										actions: ['computePreviewHeight', 'verifyAllTasks'],
										target: 'idle',
									},
								},
							},
						},
					},
				},
			},
		},
	},

	/**
	 * Options
	 */
	{
		actions: {
			setInitialData: assign((_ctx, event) => ({
				frameDoc: event.frameDoc,
				challenge: event.challenge,
				verifiedTasks: event.challenge?.tasks.map((task) => ({
					...task,
					completed: false,
				})),
			})),
			initializeStyles: assign((ctx, event) => ({
				styles: event.data,
			})),
			clearPersistedStyles: (ctx) => {
				clearSavedChallengeStyles(ctx.challenge?.slug ?? '');
			},
			updateStyles: assign((ctx, event) => ({
				styles: event.value,
			})),
			resetStyles: assign((ctx) => ({
				styles: ctx.challenge?.startingStyles ?? '',
			})),
			persistStyles: (ctx, event) => {
				saveChallengeStyles(ctx.challenge?.slug ?? '', event.value);
			},
			verifyAllTasks: assign((ctx) => ({
				verifiedTasks:
					ctx.challenge?.tasks.map((task) => ({
						...task,
						completed: verify(ctx.frameDoc as Document, task.requirement),
					})) ?? [],
			})),
			computePreviewHeight: assign((ctx) => ({
				previewHeight: ctx.frameDoc?.body.scrollHeight || 0,
			})),
		},

		services: {
			fetchSavedStyles: async (ctx) => {
				const savedStyles = getSavedChallengeStyles(ctx.challenge?.slug ?? '');
				return savedStyles ?? ctx.challenge?.startingStyles ?? '';
			},
			updatePreviewContent: async (ctx) => {
				await updatePreviewContent({
					frameDoc: ctx.frameDoc as Document,
					markup: ctx.challenge?.markup ?? '',
					styles: ctx.styles,
				});
			},
		},
	}
);
