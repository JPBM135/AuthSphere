import type { Clients, Users } from '../../../generated/database.types.js';
import type { AuthTokenType } from '../../../generated/graphql.types.js';
import { createAccessToken } from './createAccessToken.js';
import { createIdToken } from './createIdToken.js';
import { createRefreshToken } from './createRefreshToken.js';
import type { TokenResponse } from './types.js';

export class TokenBuilder<S extends 'full' | 'partial' = 'partial'> {
	private ip!: S extends 'full' ? string : string | null;

	private userAgent!: S extends 'full' ? string : string | null;

	private client!: S extends 'full' ? Clients : Clients | null;

	private nonce!: S extends 'full' ? string : string | null;

	private user!: S extends 'full' ? Users : Users | null;

	public constructor() {
		(this as TokenBuilder<'partial'>).ip = null;
		(this as TokenBuilder<'partial'>).userAgent = null;
		(this as TokenBuilder<'partial'>).client = null;
		(this as TokenBuilder<'partial'>).user = null;
		(this as TokenBuilder<'partial'>).nonce = null;
	}

	public withIp(ip: string): this {
		this.ip = ip;
		return this;
	}

	public withUserAgent(userAgent: string): this {
		this.userAgent = userAgent;
		return this;
	}

	public withClient(client: Clients): this {
		this.client = client;
		return this;
	}

	public withNonce(nonce: string): this {
		this.nonce = nonce;
		return this;
	}

	public withUser(user: Users): this {
		this.user = user;
		return this;
	}

	public async buildAccessToken(): Promise<TokenResponse<AuthTokenType.Access>> {
		this.assertRequiredFields();
		return createAccessToken(this.ip, this.userAgent, this.client, this.user.id, this.nonce);
	}

	public async buildRefreshToken(): Promise<TokenResponse<AuthTokenType.Refresh>> {
		this.assertRequiredFields();
		return createRefreshToken(this.ip, this.userAgent, this.client, this.user.id, this.nonce);
	}

	public async buildIdToken(user: Users): Promise<TokenResponse<AuthTokenType.Id>> {
		this.assertRequiredFields();
		return createIdToken(this.ip, this.userAgent, this.client, user, this.nonce);
	}

	private assertRequiredFields(): asserts this is TokenBuilder<'full'> {
		if (!this.ip || !this.userAgent || !this.client || !this.user) {
			throw new Error('Missing required parameters');
		}

		if (this.nonce && typeof this.nonce !== 'string') {
			throw new Error('Nonce must be a string');
		}
	}
}
