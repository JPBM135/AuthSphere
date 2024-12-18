import type { AppContext } from '../common/types/appContext.js';
import type { ConditionalType } from '../common/types/conditionalType.js';
import type { TypedOmit } from '../common/types/typedOmit.js';
import type {
	MutationResolvers,
	QueryResolvers,
	ResolversObject,
	ResolversTypes,
} from '../generated/graphql.types.js';

export type ReverseResolversObject<T> = T extends ResolversObject<infer U> ? U : never;

type ReversedQueryResolvers = ReverseResolversObject<QueryResolvers<AppContext>>;
type ReversedMutationResolvers = ReverseResolversObject<MutationResolvers<AppContext>>;
type ReversedResolversTypes = ReverseResolversObject<ResolversTypes>;

export type AuthSphereResolverMap<
	QryKeys extends keyof ReversedQueryResolvers | null,
	MutKeys extends keyof ReversedMutationResolvers | null,
	UnitResolvers extends keyof TypedOmit<ReversedResolversTypes, 'Mutation' | 'Query'> | null,
	// eslint-disable-next-line @typescript-eslint/sort-type-constituents
> = ConditionalType<
	QryKeys,
	null,
	object,
	{
		Query: NonNullable<Pick<QueryResolvers, NonNullable<QryKeys>>>;
	}
> &
	ConditionalType<
		UnitResolvers,
		null,
		object,
		{
			[K in NonNullable<UnitResolvers>]: ResolversTypes[K];
		}
	> &
	ConditionalType<
		MutKeys,
		null,
		object,
		{
			Mutation: NonNullable<Pick<MutationResolvers, NonNullable<MutKeys>>>;
		}
	>;

export type AuthResolverFn<
	T extends keyof ReversedMutationResolvers | keyof ReversedQueryResolvers,
> = NonNullable<
	T extends keyof ReversedQueryResolvers
		? ReversedQueryResolvers[T]
		: T extends keyof ReversedMutationResolvers
			? ReversedMutationResolvers[T]
			: never
>;
