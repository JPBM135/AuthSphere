export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
	? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
	: Lowercase<S>;

export function toCamelCase<S extends string>(str: S): CamelCase<S> {
	return str
		.toLowerCase()
		.replaceAll(/_(?<First>[a-z])/g, (_, char) => char.toUpperCase()) as CamelCase<S>;
}
