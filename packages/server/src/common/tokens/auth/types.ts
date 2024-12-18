import type { AuthTokenType } from '../../../generated/graphql.types.js';
import type { JwtClaims } from '../../../routes/well-known/enums.js';
import type { JwtPayload } from '../types.js';

export type AccessOrRefreshTokenPayload = JwtPayload<
	| JwtClaims.Aud
	| JwtClaims.Exp
	| JwtClaims.Iat
	| JwtClaims.Iss
	| JwtClaims.Jti
	| JwtClaims.Nbf
	| JwtClaims.Nonce
	| JwtClaims.Sub
>;

export type IdTokenPayload = JwtPayload<
	| JwtClaims.Aud
	| JwtClaims.Email
	| JwtClaims.Exp
	| JwtClaims.FamilyName
	| JwtClaims.GivenName
	| JwtClaims.Iat
	| JwtClaims.Iss
	| JwtClaims.Jti
	| JwtClaims.Nbf
	| JwtClaims.Nonce
	| JwtClaims.Picture
	| JwtClaims.Sub
>;

export interface TokenResponse<T extends AuthTokenType> {
	jwtId: string;
	token: string;
	type: T;
}
