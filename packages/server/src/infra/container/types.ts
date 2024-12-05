export interface ContainerToken<T> {
	readonly $type: T;
	readonly token: symbol;
}

export type Provider<T extends ContainerToken<unknown>> = T['$type'];
