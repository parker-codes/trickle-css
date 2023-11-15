import { browser } from '$app/environment';
import { convertUnitValue, parseUnitValue } from '$lib/utils/units';

export type RequirementType = 'literal' | 'unit';
export type SourceType = 'exact' | 'computed';
export type Comparator = '>' | '>=' | '<' | '<=' | '==' | '!=';

export interface Requirement {
	selector: string;
	property: string;
	type: RequirementType;
	source?: SourceType;
	comparator?: Comparator;
	value: string;
}

export type RequirementOrSet = Requirement | Requirement[];

export function verify(frameDoc: Document | null, requirement: RequirementOrSet): boolean {
	if (Array.isArray(requirement)) {
		return requirement.every((r) => verifySingle(frameDoc, r));
	} else {
		return verifySingle(frameDoc, requirement);
	}
}

function verifySingle(frameDoc: Document | null, requirement: Requirement): boolean {
	if (!browser || !frameDoc) return false;

	// TODO: could also parse the code var itself instead of inspecting the DOM
	const el: HTMLElement | null = frameDoc.querySelector(requirement.selector);
	if (!el) return false;

	const value = getValue(requirement, el);

	switch (requirement.type) {
		case 'literal':
			return literalMatches(requirement, value);
		case 'unit':
			return unitMatches(requirement, el, value);
	}
}

// defaults to computed value
function getValue(requirement: Requirement, el: HTMLElement): string {
	switch (requirement?.source) {
		case 'exact':
			return getExactValue(el, requirement.property);
		case 'computed':
		default:
			return getComputedValue(el, requirement.property);
	}
}
function getExactValue(el: HTMLElement, property: string): string {
	return el.computedStyleMap().get(property)?.toString() ?? '';
}
function getComputedValue(el: HTMLElement, property: string): string {
	const style = window.getComputedStyle(el);
	return style.getPropertyValue(property);
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

function unitMatches(requirement: Requirement, el: HTMLElement, value: string): boolean {
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
