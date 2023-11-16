// @ts-expect-error No types for this package
import units from 'units-css';

interface UnitValue {
	value: number;
	unit: string;
}
export function parseUnitValue(value: string | number, property?: string): UnitValue {
	try {
		return units.parse(value, property);
	} catch (e) {
		return { value: 0, unit: '' };
	}
}

// NOTE: transform should not be passed directly as the property name - instead specify a transform keyword (e.g. rotate)
export function convertUnitValue(
	expectedUnit: string,
	value: string | number,
	el: HTMLElement | null,
	property?: string
): number | null {
	try {
		return units.convert(expectedUnit, value, el, property);
	} catch (e) {
		return null;
	}
}
