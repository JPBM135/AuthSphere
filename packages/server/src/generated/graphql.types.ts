import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AuthResponse = NextStepAuthResponse | SuccessAuthResponse;

export enum AuthStepType {
  /** Prompt the user for accepting scopes */
  AcceptScopes = 'ACCEPT_SCOPES',
  /** 2FA Authentication app */
  TwoFactorAuthenticatorApp = 'TWO_FACTOR_AUTHENTICATOR_APP',
  /** 2FA Email code */
  TwoFactorEmail = 'TWO_FACTOR_EMAIL',
  /** 2FA Passkey */
  TwoFactorPasskey = 'TWO_FACTOR_PASSKEY'
}

export type AuthToken = {
  __typename?: 'AuthToken';
  /** The authentication token, the format of the token will depend on the type */
  token: Scalars['String']['output'];
  /** Type of the token */
  type: AuthTokenType;
};

export enum AuthTokenType {
  /** Access token */
  Access = 'ACCESS',
  /** Authorization code */
  AuthorizationCode = 'AUTHORIZATION_CODE',
  /** ID token */
  Id = 'ID',
  /** Refresh token */
  Refresh = 'REFRESH'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Continues the authentication process */
  nextStepAuth: AuthResponse;
  /** Starts the authentication process */
  startAuth: AuthResponse;
};


export type MutationNextStepAuthArgs = {
  input: NextStepAuthPayload;
};


export type MutationStartAuthArgs = {
  input: StartAuthPayload;
};

export type NextStepAuthPayload = {
  /** Auth attempt ID */
  authAttemptToken: Scalars['String']['input'];
  /** Code to be used in the next step, if required */
  code: Scalars['String']['input'];
  /** Step type */
  type: AuthStepType;
};

export type NextStepAuthResponse = {
  __typename?: 'NextStepAuthResponse';
  /** Auth attempt ID */
  authAttemptToken: Scalars['String']['output'];
  /**
   * Next step type, if more than one is passed, the user will be prompted to choose one
   * if only one is passed, the user will be redirected to the step provided
   */
  nextStepTypes: Array<AuthStepType>;
};

export type Query = {
  __typename?: 'Query';
  /** Checks if the user is authenticated */
  isAuthenticated: Scalars['Boolean']['output'];
};


export type QueryIsAuthenticatedArgs = {
  token: Scalars['String']['input'];
};

export type StartAuthPayload = {
  /** The user's email address */
  email: Scalars['String']['input'];
  /** If redirected from the OAuth api, this will contain the OAuth session code */
  oAuthToken?: InputMaybe<Scalars['String']['input']>;
  /** The user's password */
  password: Scalars['String']['input'];
};

export type SuccessAuthResponse = {
  __typename?: 'SuccessAuthResponse';
  /** Password reset timestamp, if the password reset is required */
  passwordResetTimestamp?: Maybe<Scalars['DateTime']['output']>;
  /** Redirect URL, if the oauth code was provided */
  redirectUrl?: Maybe<Scalars['String']['output']>;
  /** Authentication token */
  tokens: Array<AuthToken>;
};

export type User = {
  __typename?: 'User';
  /** URL of the user's avatar */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  /** Email address of the user */
  email: Scalars['String']['output'];
  /** First name of the user */
  firstName: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['String']['output'];
  /** Last name of the user */
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  AuthResponse: ( NextStepAuthResponse ) | ( SuccessAuthResponse );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AuthResponse']>;
  AuthStepType: AuthStepType;
  AuthToken: ResolverTypeWrapper<AuthToken>;
  AuthTokenType: AuthTokenType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NextStepAuthPayload: NextStepAuthPayload;
  NextStepAuthResponse: ResolverTypeWrapper<NextStepAuthResponse>;
  Query: ResolverTypeWrapper<{}>;
  StartAuthPayload: StartAuthPayload;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SuccessAuthResponse: ResolverTypeWrapper<SuccessAuthResponse>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: ResolversUnionTypes<ResolversParentTypes>['AuthResponse'];
  AuthToken: AuthToken;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Mutation: {};
  NextStepAuthPayload: NextStepAuthPayload;
  NextStepAuthResponse: NextStepAuthResponse;
  Query: {};
  StartAuthPayload: StartAuthPayload;
  String: Scalars['String']['output'];
  SuccessAuthResponse: SuccessAuthResponse;
  User: User;
}>;

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NextStepAuthResponse' | 'SuccessAuthResponse', ParentType, ContextType>;
}>;

export type AuthTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthToken'] = ResolversParentTypes['AuthToken']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AuthTokenType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  nextStepAuth?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationNextStepAuthArgs, 'input'>>;
  startAuth?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationStartAuthArgs, 'input'>>;
}>;

export type NextStepAuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NextStepAuthResponse'] = ResolversParentTypes['NextStepAuthResponse']> = ResolversObject<{
  authAttemptToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextStepTypes?: Resolver<Array<ResolversTypes['AuthStepType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  isAuthenticated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIsAuthenticatedArgs, 'token'>>;
}>;

export type SuccessAuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SuccessAuthResponse'] = ResolversParentTypes['SuccessAuthResponse']> = ResolversObject<{
  passwordResetTimestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  redirectUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokens?: Resolver<Array<ResolversTypes['AuthToken']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  AuthToken?: AuthTokenResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NextStepAuthResponse?: NextStepAuthResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SuccessAuthResponse?: SuccessAuthResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

