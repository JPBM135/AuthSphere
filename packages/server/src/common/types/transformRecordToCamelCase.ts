export type CamelCase<TString extends string> =
	TString extends `${infer BeforeUndescore}_${infer AfterUnderscore}${infer RemainingString}`
		? `${Lowercase<BeforeUndescore>}${Uppercase<AfterUnderscore>}${CamelCase<RemainingString>}`
		: Lowercase<TString>;

export type TransformRecordToCamelCase<T> = {
	[K in keyof T as CamelCase<K & string>]: T[K] extends Date
		? string
		: T[K] extends object
			? TransformRecordToCamelCase<T[K]>
			: T[K];
};
