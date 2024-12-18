export enum OAuthScopes {
	OfflineAccess = 'meta:offline_access',
	OpenId = 'openid',
	OpenIdEmail = 'openid:email',
	OpenIdProfile = 'openid:profile',
}

interface IOAuthScopesMetadata {
	action: 'read' | 'write';
	description: string;
	required: boolean;
}

export const OAuthScopesMetadata: Record<OAuthScopes, IOAuthScopesMetadata> = {
	[OAuthScopes.OpenId]: {
		required: true,
		action: 'read',
		description: 'Access to the OpenId Connect protocol',
	},
	[OAuthScopes.OpenIdEmail]: {
		required: false,
		action: 'read',
		description: 'Access to the user email',
	},
	[OAuthScopes.OpenIdProfile]: {
		required: false,
		action: 'read',
		description: 'Access to the user profile',
	},
	[OAuthScopes.OfflineAccess]: {
		required: false,
		action: 'read',
		description:
			'When requesting an access token, the client can request that the authorization server issue a refresh token',
	},
};
