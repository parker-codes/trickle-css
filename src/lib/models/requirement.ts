import { browser } from '$app/environment';

export type RequirementType = 'property' | 'variable';

export type PropertyType = 'literal' | 'number';

export type Comparator = '>' | '>=' | '<' | '<=' | '==' | '!=';

export interface Requirement {
	type: RequirementType;
	selector: string;
	property: string;
	propertyType: PropertyType;
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
	const style = window.getComputedStyle(el);

	// this works for both properties and variables
	const value = style.getPropertyValue(requirement.property);

	switch (requirement.propertyType) {
		case 'literal':
			return value === requirement.value;
		case 'number':
			return verifyNumber(requirement, value);
	}
}

function verifyNumber(requirement: Requirement, value: string): boolean {
	// TODO: need better parsing than only handling generic numbers; should be able to do px, rem, etc
	const actual = parseInt(value, 10);
	const expected = parseInt(requirement.value, 10);

	switch (requirement.comparator) {
		case '>':
			return actual > expected;
		case '>=':
			return actual >= expected;
		case '<':
			return actual < expected;
		case '<=':
			return actual <= expected;
		case '==':
			return actual === expected;
		case '!=':
			return actual !== expected;
		default:
			return false;
	}
}
