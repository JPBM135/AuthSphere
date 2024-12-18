import type {
	AppSupportedClaims,
	OpenIdCodeChallengeMethod,
	OpenIdGrantType,
	OpenIdResponseType,
	OpenIdSigningAlgorithm,
	OpenIdSubjectType,
	OpenIdTokenEndpointAuthMethod,
} from './enums.js';

export interface OpenIDConfiguration {
	/**
	 * Allows additional properties for extensibility
	 */
	[key: string]: any;
	/**
	 * URL of the authorization endpoint
	 */
	authorization_endpoint: string;
	/**
	 * List of supported claims (optional)
	 */
	claims_supported?: (AppSupportedClaims['optional'] | AppSupportedClaims['required'])[];
	/**
	 * Supported methods for PKCE (optional)
	 */
	code_challenge_methods_supported?: OpenIdCodeChallengeMethod[];
	/**
	 * URL of the end session endpoint (optional)
	 */
	end_session_endpoint?: string;
	/**
	 * List of supported grant types (optional)
	 */
	grant_types_supported?: OpenIdGrantType[];
	/**
	 * Supported signing algorithms for ID tokens
	 */
	id_token_signing_alg_values_supported: OpenIdSigningAlgorithm[];
	/**
	 * URL of the introspection endpoint (optional)
	 */
	introspection_endpoint?: string;
	/**
	 * The issuer URL of the OpenID provider
	 */
	issuer: string;
	/**
	 * URL of the JSON Web Key Set
	 */
	jwks_uri: string;
	/**
	 * URL of the client registration endpoint (optional)
	 */
	registration_endpoint?: string;
	/**
	 * List of supported response types
	 */
	response_types_supported: OpenIdResponseType[];
	/**
	 * URL of the revocation endpoint (optional)
	 */
	revocation_endpoint?: string;
	/**
	 * List of supported scopes
	 */
	scopes_supported?: string[];
	/**
	 * List of supported subject types
	 */
	subject_types_supported: OpenIdSubjectType[];
	/**
	 * URL of the token endpoint
	 */
	token_endpoint: string;
	/**
	 * Supported authentication methods for token endpoint (optional)
	 */
	token_endpoint_auth_methods_supported?: OpenIdTokenEndpointAuthMethod[];
	/**
	 * URL of the user info endpoint (optional)
	 */
	userinfo_endpoint?: string;
}
