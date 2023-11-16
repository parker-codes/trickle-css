import { browser } from '$app/environment';
import { convertUnitValue, parseUnitValue } from '$lib/utils/units';

let userStylesRules: CSSRuleList | undefined;

export type RequirementType = 'literal' | 'unit';
export type SourceType = 'exact' | 'computed';
export type Comparator = '>' | '>=' | '<' | '<=' | '==' | '!=';

export interface Requirement {
	selector: string;
	pseudoSelector?: string;
	property: string;
	type: RequirementType;
	source?: SourceType;
	comparator?: Comparator;
	value: string;
}

export type RequirementOrSet = Requirement | Requirement[];

export function verify(frameDoc: Document | null, requirement: RequirementOrSet): boolean {
	// side effect
	if (browser && !userStylesRules) {
		const userStyles = frameDoc?.getElementById('user-styles') as HTMLStyleElement;
		userStylesRules = userStyles?.sheet?.cssRules;
	}

	if (Array.isArray(requirement)) {
		return requirement.every((r) => verifySingle(frameDoc, r));
	} else {
		return verifySingle(frameDoc, requirement);
	}
}

function verifySingle(frameDoc: Document | null, requirement: Requirement): boolean {
	if (!browser || !frameDoc) return false;

	const el: HTMLElement | null = frameDoc.querySelector(requirement.selector);

	const value = getValue(requirement, el);
	// console.log({ value, requirement });

	switch (requirement.type) {
		case 'literal':
			return literalMatches(requirement, value);
		case 'unit':
			return unitMatches(requirement, el, value);
	}
}

// defaults to computed value
function getValue(requirement: Requirement, el: HTMLElement | null): string {
	switch (requirement?.source) {
		case 'exact':
			return getExactValue(requirement);
		case 'computed':
		default:
			return getComputedValue(el, requirement);
	}
}
function getExactValue(requirement: Requirement): string {
	if (!userStylesRules) return '';

	let selector = requirement.selector;
	if (requirement.pseudoSelector) selector += requirement.pseudoSelector;

	for (const rule of userStylesRules) {
		// @ts-expect-error - selectorText exists
		if (rule?.selectorText === selector) {
			// check first before early return
			// @ts-expect-error - style exists
			if (rule?.style.getPropertyValue(requirement.property)) {
				// @ts-expect-error - style exists
				return rule?.style.getPropertyValue(requirement.property);
			}
		}
	}

	// no match found
	return '';
}
function getComputedValue(el: HTMLElement | null, requirement: Requirement): string {
	if (!el) return '';
	const style = window.getComputedStyle(el, requirement.pseudoSelector);
	return style.getPropertyValue(requirement.property);
}

function literalMatches(requirement: Requirement, value: string): boolean {
	switch (requirement.comparator) {
		case '!=':
			return value !== requirement.value;
		case '==':
		default:
			return value === requirement.value;
	}
}

function unitMatches(requirement: Requirement, el: HTMLElement | null, value: string): boolean {
	const expected = parseUnitValue(requirement.value, requirement.property);

	const convertedValue = convertUnitValue(expected.unit, value, el, requirement.property);
	if (convertedValue === null) return false;

	switch (requirement.comparator) {
		case '>':
			return convertedValue > expected.value;
		case '>=':
			return convertedValue >= expected.value;
		case '<':
			return convertedValue < expected.value;
		case '<=':
			return convertedValue <= expected.value;
		case '!=':
			return convertedValue !== expected.value;
		case '==':
		default:
			return convertedValue === expected.value;
	}
}
