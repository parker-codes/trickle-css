import { browser } from '$app/environment';
// @ts-expect-error No types for this package
import units from 'units-css';

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

	console.log('requirement', {
		property: requirement.property,
		type: requirement.type,
		source: requirement.source,
		value: requirement.value,
	});

	// defaults to computed
	const value =
		requirement?.source === 'exact'
			? getExactValue(el, requirement.property)
			: getComputedValue(el, requirement.property);

	switch (requirement.type) {
		case 'literal': {
			console.log('literal', value);
			const result = value === requirement.value;
			console.log('result', result);
			return result;
		}
		case 'unit': {
			console.log('unit', value);
			const result = verifyNumber(requirement, el, value);
			console.log('result', result);
			return result;
		}
	}
}

function getExactValue(el: HTMLElement, property: string): string {
	return el.computedStyleMap().get(property)?.toString() ?? '';
}
function getComputedValue(el: HTMLElement, property: string): string {
	const style = window.getComputedStyle(el);
	return style.getPropertyValue(property);
}

interface UnitValue {
	value: number;
	unit: string;
}
function parseUnitValue(value: string | number, property?: string): UnitValue {
	return units.parse(value, property);
}

function verifyNumber(requirement: Requirement, el: HTMLElement, value: string): boolean {
	const expected = parseUnitValue(requirement.value, requirement.property);

	// NOTE: transform should not be passed directly as the property name - instead specify a transform keyword (e.g. rotate)
	const convertedValue: number = units.convert(expected.unit, value, el, requirement.property);
	console.log('converted', convertedValue);

	switch (requirement.comparator) {
		case '==':
			return expected.value === convertedValue;
		case '!=':
			return expected.value !== convertedValue;
		case '>':
			return expected.value > convertedValue;
		case '>=':
			return expected.value >= convertedValue;
		case '<':
			return expected.value < convertedValue;
		case '<=':
			return expected.value <= convertedValue;
		default:
			return false;
	}
}
