/**
 * Represents the grant types supported by an OpenID provider.
 * These specify how the client can obtain tokens.
 */
export enum OpenIdGrantType {
	/**
	 * Authorization Code flow (recommended for server-side apps)
	 */
	AUTHORIZATION_CODE = 'authorization_code',
	/**
	 * Client Credentials flow (for machine-to-machine authentication)
	 */
	CLIENT_CREDENTIALS = 'client_credentials',
	/**
	 * Device Code flow (used for devices with limited input capabilities)
	 */
	DEVICE_CODE = 'urn:ietf:params:oauth:grant-type:device_code',
	/**
	 * Implicit flow (legacy, not recommended)
	 */
	IMPLICIT = 'implicit',
	/**
	 * Resource Owner Password Credentials flow (not recommended)
	 */
	PASSWORD = 'password',
	/**
	 * Refresh Token flow (to renew tokens without user interaction)
	 */
	REFRESH_TOKEN = 'refresh_token',
}

/**
 * Represents the response types supported by an OpenID provider.
 * These determine the authorization response returned to the client.
 */
export enum OpenIdResponseType {
	/**
	 * Authorization Code
	 */
	CODE = 'code',
	/**
	 * Authorization Code + ID Token
	 */
	CODE_ID_TOKEN = 'code id_token',
	/**
	 * Authorization Code + ID Token + Access Token
	 */
	CODE_ID_TOKEN_TOKEN = 'code id_token token',
	/**
	 * Authorization Code + Access Token
	 */
	CODE_TOKEN = 'code token',
	/**
	 * Implicit Flow: ID Token
	 */
	ID_TOKEN = 'id_token',
	/**
	 * Implicit Flow: ID Token + Access Token
	 */
	ID_TOKEN_TOKEN = 'id_token token',
	/**
	 * Implicit Flow: Access Token
	 */
	TOKEN = 'token',
}

/**
 * Represents the subject types supported by an OpenID provider.
 * These specify how user identifiers are represented.
 */
export enum OpenIdSubjectType {
	/**
	 * Pairwise subject type: unique identifier per client
	 */
	PAIRWISE = 'pairwise',
	/**
	 * Public subject type: same identifier across all clients
	 */
	PUBLIC = 'public',
}

/**
 * Represents the signing algorithms supported for ID tokens.
 * These algorithms specify how tokens are digitally signed.
 */
export enum OpenIdSigningAlgorithm {
	/**
	 * ECDSA with SHA-256
	 */
	ES256 = 'ES256',
	/**
	 * HMAC with SHA-256
	 */
	HS256 = 'HS256',
	/**
	 * RSA with SHA-256
	 */
	RS256 = 'RS256',
}

/**
 * Represents the authentication methods supported for the token endpoint.
 */
export enum OpenIdTokenEndpointAuthMethod {
	/**
	 * Client authentication using HTTP Basic Authentication
	 */
	CLIENT_SECRET_BASIC = 'client_secret_basic',
	/**
	 * Client authentication using a signed JWT with client secret
	 */
	CLIENT_SECRET_JWT = 'client_secret_jwt',
	/**
	 * Client authentication using POST body
	 */
	CLIENT_SECRET_POST = 'client_secret_post',
	/**
	 * No authentication required
	 */
	NONE = 'none',
	/**
	 * Client authentication using a signed JWT with private key
	 */
	PRIVATE_KEY_JWT = 'private_key_jwt',
}

/**
 * Represents the code challenge methods supported by the OpenID provider.
 * These methods are used in PKCE (Proof Key for Code Exchange).
 */
export enum OpenIdCodeChallengeMethod {
	/**
	 * Plain-text code challenge (not recommended)
	 */
	PLAIN = 'plain',
	/**
	 * SHA-256 hashed code challenge (recommended)
	 */
	S256 = 'S256',
}

/**
 * Enum representing JWT (JSON Web Token) Claims as defined by various standards (OpenID, IESG, IETF, etc.).
 */
export enum JwtClaims {
	/**
	 * Authentication Context Class Reference - Indicates how the end-user authentication was performed.
	 */
	Acr = 'acr',

	/**
	 * Address - End-user's preferred postal address.
	 */
	Address = 'address',

	/**
	 * Authentication Methods References - Identifies the authentication methods used.
	 */
	Amr = 'amr',

	/**
	 * Audience - Identifies the recipients that the JWT is intended for.
	 */
	Aud = 'aud',

	/**
	 * Authorized Party - Identifies the party authorized to use the token.
	 */
	Azp = 'azp',

	/**
	 * Birthdate - End-user's birthdate.
	 */
	Birthdate = 'birthdate',

	/**
	 * Email - End-user's email address.
	 */
	Email = 'email',

	/**
	 * Email Verified - Indicates if the end-user's email address has been verified.
	 */
	EmailVerified = 'email_verified',

	/**
	 * Expiration Time - Identifies the expiration time on or after which the JWT must not be accepted for processing.
	 */
	Exp = 'exp',

	/**
	 * Family Name - End-user's family name(s) or last name(s).
	 */
	FamilyName = 'family_name',

	/**
	 * Gender - End-user's gender.
	 */
	Gender = 'gender',

	/**
	 * Given Name - End-user's given name(s) or first name(s).
	 */
	GivenName = 'given_name',

	/**
	 * Issued At - Identifies the time at which the JWT was issued.
	 */
	Iat = 'iat',

	/**
	 * Issuer - Identifies the principal that issued the JWT.
	 */
	Iss = 'iss',

	/**
	 * JWT ID - Provides a unique identifier for the JWT.
	 */
	Jti = 'jti',

	/**
	 * Locale - End-user's locale.
	 */
	Locale = 'locale',

	/**
	 * Middle Name - End-user's middle name(s).
	 */
	MiddleName = 'middle_name',

	/**
	 * Name - End-user's full name.
	 */
	Name = 'name',

	/**
	 * Not Before - Identifies the time before which the JWT must not be accepted for processing.
	 */
	Nbf = 'nbf',

	/**
	 * Nickname - Casual name of the end-user.
	 */
	Nickname = 'nickname',

	/**
	 * Nonce - String value used to associate a client session with an ID Token.
	 */
	Nonce = 'nonce',

	/**
	 * Phone Number - End-user's phone number.
	 */
	PhoneNumber = 'phone_number',

	/**
	 * Phone Number Verified - Indicates if the end-user's phone number has been verified.
	 */
	PhoneNumberVerified = 'phone_number_verified',

	/**
	 * Picture - URL of the end-user's profile picture.
	 */
	Picture = 'picture',

	/**
	 * Preferred Username - Shorthand name by which the end-user wishes to be referred to.
	 */
	PreferredUsername = 'preferred_username',

	/**
	 * Profile - URL of the end-user's profile page.
	 */
	Profile = 'profile',

	/**
	 * Scope - Indicates the scope of access granted by the JWT.
	 */
	Scope = 'scope',

	/**
	 * Subject - Identifies the subject of the JWT.
	 */
	Sub = 'sub',

	/**
	 * Updated At - Time the end-user's information was last updated.
	 */
	UpdatedAt = 'updated_at',

	/**
	 * Website - URL of the end-user's web page or blog.
	 */
	Website = 'website',

	/**
	 * Zoneinfo - String from zoneinfo time zone database representing the user's time zone.
	 */
	Zoneinfo = 'zoneinfo',
}

export interface AppSupportedClaims {
	optional:
		| JwtClaims.Address
		| JwtClaims.Birthdate
		| JwtClaims.Email
		| JwtClaims.EmailVerified
		| JwtClaims.FamilyName
		| JwtClaims.GivenName
		| JwtClaims.Locale
		| JwtClaims.PhoneNumber
		| JwtClaims.Picture;
	required:
		| JwtClaims.Aud
		| JwtClaims.Exp
		| JwtClaims.Iat
		| JwtClaims.Iss
		| JwtClaims.Jti
		| JwtClaims.Nbf
		| JwtClaims.Nonce
		| JwtClaims.Sub;
}
