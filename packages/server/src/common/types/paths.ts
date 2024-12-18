type Join<K, P> = K extends number | string
	? P extends number | string
		? `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never;

type Prev = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends any[]
		? ''
		: T extends object
			? {
					[K in keyof T]-?: K extends number | string
						? Join<K, Paths<T[K], Prev[D]>> | `${K}`
						: never;
				}[keyof T]
			: '';

export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends any[]
		? ''
		: T extends object
			? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
			: '';
