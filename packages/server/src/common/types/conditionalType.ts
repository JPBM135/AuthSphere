export type ConditionalType<TCondition, TExpected, TTrue, TFalse> = TCondition extends TExpected
	? TTrue
	: TFalse;
