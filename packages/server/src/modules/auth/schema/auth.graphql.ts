import { gql } from 'graphql-tag';

export const schema = gql`
	type Mutation {
		"""
		Starts the authentication process
		"""
		startAuth(input: StartAuthPayload!): AuthResponse!

		"""
		Continues the authentication process
		"""
		nextStepAuth(input: NextStepAuthPayload!): AuthResponse!
	}

	type Query {
		"""
		Checks if the user is authenticated
		"""
		isAuthenticated(token: String!): Boolean!
	}

	enum AuthStepType {
		"""
		2FA Authentication app
		"""
		TWO_FACTOR_AUTHENTICATOR_APP

		"""
		2FA Email code
		"""
		TWO_FACTOR_EMAIL

		"""
		2FA Passkey
		"""
		TWO_FACTOR_PASSKEY

		"""
		Prompt the user for accepting scopes
		"""
		ACCEPT_SCOPES
	}

	enum AuthTokenType {
		"""
		Access token
		"""
		ACCESS

		"""
		Refresh token
		"""
		REFRESH

		"""
		ID token
		"""
		ID

		"""
		Authorization code
		"""
		AUTHORIZATION_CODE
	}

	input StartAuthPayload {
		"""
		If redirected from the OAuth api, this will contain the OAuth session code
		"""
		oAuthToken: String

		"""
		The user's email address
		"""
		email: String!

		"""
		The user's password
		"""
		password: String!
	}

	input NextStepAuthPayload {
		"""
		Auth attempt ID
		"""
		authAttemptToken: String!

		"""
		Step type
		"""
		type: AuthStepType!

		"""
		Code to be used in the next step, if required
		"""
		code: String!
	}

	type AuthToken {
		"""
		Type of the token
		"""
		type: AuthTokenType!
		"""
		The authentication token, the format of the token will depend on the type
		"""
		token: String!
	}

	type SuccessAuthResponse {
		"""
		Authentication token
		"""
		tokens: [AuthToken!]!

		"""
		Redirect URL, if the oauth code was provided
		"""
		redirectUrl: String

		"""
		Password reset timestamp, if the password reset is required
		"""
		passwordResetTimestamp: DateTime
	}

	type NextStepAuthResponse {
		"""
		Auth attempt ID
		"""
		authAttemptToken: String!

		"""
		Next step type, if more than one is passed, the user will be prompted to choose one
		if only one is passed, the user will be redirected to the step provided
		"""
		nextStepTypes: [AuthStepType!]!
	}

	union AuthResponse = SuccessAuthResponse | NextStepAuthResponse
`;
