import { browser } from '$app/environment';
// @ts-expect-error No types for this package
import units from 'units-css';

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
	// const value = style.getPropertyValue(requirement.property);
	console.log('property', requirement.property);

	// TODO: could try el.computedStyleMap().get(requirement.property) instead
	// THIS WORKS!!! (but only on Chromium)
	// const mapValue = el.computedStyleMap().get(requirement.property)?.toString() ?? '';
	// console.log({
	// 	property: requirement.property,
	// 	value,
	// 	mapValue,
	// 	// mapValueNumeric: CSSNumericValue.parse(mapValue),
	// 	mapValueEquals: mapValue === requirement.value,
	// });

	// NOTE: transform should not be passed directly as the property name - instead specify a transform keyword (e.g. rotate)

	switch (requirement.propertyType) {
		case 'literal': {
			const value = el.computedStyleMap().get(requirement.property)?.toString() ?? '';
			console.log({ value, requirement: requirement.value, property: requirement.property });
			return value === requirement.value;
		}
		case 'number': {
			const computedValue = style.getPropertyValue(requirement.property);
			console.log('computed value', computedValue);
			const converted = units.convert('px', computedValue, el, requirement.property);
			console.log('converted', converted);
			// return verifyNumber(requirement, value);
		}
	}
}

function verifyNumber(requirement: Requirement, value: string): boolean {
	// TODO: need better parsing than only handling generic numbers; should be able to do px, rem, etc
	// const actual = CSSNumericValue.parse(value);
	// const expected = CSSNumericValue.parse(requirement.value);
	// console.log({ actual, expected, property: requirement.property });

	switch (requirement.comparator) {
		case '==':
			return actual.equals(expected);
		case '!=':
			return !actual.equals(expected);
		case '>':
			if (actual.unit !== expected.unit) return false;
			return actual.value > expected.value;
		case '>=':
			if (actual.unit !== expected.unit) return false;
			return actual.value >= expected.value;
		case '<':
			if (actual.unit !== expected.unit) return false;
			return actual.value < expected.value;
		case '<=':
			if (actual.unit !== expected.unit) return false;
			return actual.value <= expected.value;
		default:
			return false;
	}
}
