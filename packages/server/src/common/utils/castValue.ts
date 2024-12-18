export function castToNumber(value: unknown): number | null {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : null;
	}

	const parsedValue = Number(value);
	if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
		return null;
	}

	return parsedValue;
}

export function castToBoolean(value: unknown): boolean | null {
	if (typeof value === 'boolean') {
		return value;
	}

	if (value === 'true' || value === '1' || value === 1) {
		return true;
	}

	if (value === 'false' || value === '0' || value === 0) {
		return false;
	}

	return null;
}

export function castToArray(value: unknown): string[] | null {
	if (Array.isArray(value)) {
		return value.map(String);
	}

	if (typeof value === 'string') {
		return value.split(',').map((item) => item.trim());
	}

	return null;
}
