import { ErrorCodes } from '../errors/errorCodes.js';
import { type SendResponseError } from '../response/sendResponse.js';
import { castToArray, castToBoolean, castToNumber } from '../utils/castValue.js';

export enum QueryParameterType {
	Array = 'array',
	Boolean = 'boolean',
	Number = 'number',
	String = 'string',
}

export type AssertQueryParameterType<T extends QueryParameterType> =
	T extends QueryParameterType.Boolean
		? boolean
		: T extends QueryParameterType.Number
			? number
			: T extends QueryParameterType.String
				? string
				: T extends QueryParameterType.Array
					? string[]
					: never;

export class MissingOrInvalidQueryParameterError extends Error implements SendResponseError {
	public code!: ErrorCodes;

	public constructor(type: 'invalid' | 'missing', key: string) {
		let errorMessage = '';
		let errorCode: ErrorCodes = ErrorCodes.InvalidQueryParameter;

		if (type === 'invalid') {
			errorCode = ErrorCodes.InvalidQueryParameter;
			errorMessage = `Query parameter "${key}" is invalid`;
		}

		if (type === 'missing') {
			errorCode = ErrorCodes.MissingQueryParameter;
			errorMessage = `Query parameter "${key}" is missing`;
		}

		super(errorMessage);

		this.code = errorCode;
	}

	public static assert(
		condition: boolean,
		type: 'invalid' | 'missing',
		key: string,
	): asserts condition {
		if (!condition) {
			throw new MissingOrInvalidQueryParameterError(type, key);
		}
	}
}

export function assertQueryParameter<K extends string, T extends QueryParameterType>(
	query: Record<string, unknown>,
	key: K,
	type: T,
	required: boolean = true,
): AssertQueryParameterType<T> {
	const value = Reflect.get(query, key);

	if (required) {
		MissingOrInvalidQueryParameterError.assert(
			value !== undefined && value !== null,
			'missing',
			key,
		);
	}

	let parsedValue: string[] | boolean | number | string | null = null;

	switch (type) {
		case QueryParameterType.Boolean:
			parsedValue = castToBoolean(value);
			MissingOrInvalidQueryParameterError.assert(typeof parsedValue === 'boolean', 'invalid', key);
			break;
		case QueryParameterType.Number:
			parsedValue = castToNumber(value);
			MissingOrInvalidQueryParameterError.assert(typeof parsedValue === 'number', 'invalid', key);
			break;
		case QueryParameterType.String:
			MissingOrInvalidQueryParameterError.assert(
				Boolean(typeof value === 'string' && value.length),
				'invalid',
				key,
			);
			break;
		case QueryParameterType.Array:
			parsedValue = castToArray(value);

			MissingOrInvalidQueryParameterError.assert(
				Array.isArray(parsedValue) && parsedValue.length > 0,
				'invalid',
				key,
			);
			break;
		default:
			MissingOrInvalidQueryParameterError.assert(false, 'invalid', key);
	}

	return (parsedValue ?? value) as AssertQueryParameterType<T>;
}
