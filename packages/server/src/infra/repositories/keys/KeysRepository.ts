import { generateJwkKeyPair } from '../../../common/keys/generateJwkKeyPair.js';
import { TimeSpan } from '../../../common/timespan/TimeSpan.js';
import { CONFIG } from '../../../config.js';
import type {
	signing_key_lifetime_type,
	signing_key_log_action,
	signing_key_log_status,
	SigningKeys,
} from '../../../generated/database-keys.types.js';
import { resolveToken } from '../../container/resolveToken.js';
import { SecureDatabaseToken } from '../../database/createDatabase.js';
import Logger from '../../logger/index.js';
import { SnowflakeToken } from '../../snowflake/createSnowflake.js';

export class KeysRepository {
	private readonly snowflake = resolveToken(SnowflakeToken);

	private readonly db = resolveToken(SecureDatabaseToken);

	private readonly logger = Logger.getInstance().createChildren('KeysRepository');

	public async getPubKeys(): Promise<
		Pick<SigningKeys, 'id' | 'lifetime' | 'x_component' | 'y_component'>[]
	> {
		this.logger.info('Getting public keys');
		return this.db.table('signing_keys').select('lifetime', 'id', 'x_component', 'y_component');
	}

	public async getPubKeyById(
		id: string,
	): Promise<Pick<SigningKeys, 'id' | 'lifetime' | 'x_component' | 'y_component'>> {
		this.logger.info(`Getting public key by id`, { id });
		return this.db
			.table('signing_keys')
			.where('id', id)
			.select('lifetime', 'id', 'x_component', 'y_component')
			.first();
	}

	public async getLatestKeyWithPrivate({
		ip,
		userAgent,
		userId,
		lifetime,
	}: {
		ip: string;
		lifetime: signing_key_lifetime_type;
		userAgent: string;
		userId: string;
	}): Promise<SigningKeys> {
		await this.checkRateLimits(ip, userId, userAgent);

		const key = await this.findLatestKeyAndRotateIfNeeded(lifetime);

		if (!key) {
			throw new Error('Key not found');
		}

		await this.addLog({
			ip,
			userAgent,
			userId,
			signingKeyId: key.id,
			status: 'success',
		});

		return key;
	}

	private async checkRateLimits(ip: string, userId: string, userAgent: string) {
		if (await this.ipExceedsLimit(ip)) {
			await this.logAndThrowRateLimitExceeded(ip, userAgent, userId, 'IP exceeded limit');
		}

		if (await this.ipAndUserIdExceedsLimit(ip, userId)) {
			await this.logAndThrowRateLimitExceeded(
				ip,
				userAgent,
				userId,
				'IP and user ID exceeded limit',
			);
		}
	}

	private async logAndThrowRateLimitExceeded(
		ip: string,
		userAgent: string,
		userId: string,
		errorMessage: string,
	) {
		this.logger.warn(errorMessage, { ip, userAgent, userId });
		await this.addLog({
			ip,
			userAgent,
			userId,
			signingKeyId: null,
			status: 'failed',
			errorMessage,
		});
		throw new Error('Forbidden');
	}

	private async findLatestKeyAndRotateIfNeeded(lifetime: signing_key_lifetime_type) {
		const latestKey = await this.db('signing_keys')
			.select('*')
			.where({ lifetime })
			.orderBy('created_at', 'desc')
			.first();

		if (!latestKey) {
			return this.rotateKeys(lifetime);
		}

		const KEY_CONFIG = lifetime === 'short' ? CONFIG.KEYS.SHORT_LIVED : CONFIG.KEYS.LONG_LIVED;
		const timeSpanFromCreation = TimeSpan.fromDate(latestKey.created_at);

		if (await this.isKeyExpiredOrShouldBeDeleted(latestKey.id, timeSpanFromCreation, KEY_CONFIG)) {
			this.logger.info(`Key with id ${latestKey.id} is expired or should be deleted, rotating`);
			return this.rotateKeys(lifetime);
		}

		return latestKey;
	}

	private async isKeyExpiredOrShouldBeDeleted(
		keyId: string,
		timeSpanFromCreation: TimeSpan,
		KEY_CONFIG: {
			DELETION: TimeSpan;
			EXPIRATION: TimeSpan;
		},
	) {
		const isExpired = timeSpanFromCreation.add(KEY_CONFIG.EXPIRATION).isPast();
		const shouldBeDeleted = timeSpanFromCreation.add(KEY_CONFIG.DELETION).isPast();

		if (shouldBeDeleted) {
			this.logger.info(`Deleting key with id ${keyId}`);
			await this.deleteKey(keyId);
		}

		return isExpired || shouldBeDeleted;
	}

	private async rotateKeys(lifetime: signing_key_lifetime_type) {
		this.logger.info(`Rotating keys with lifetime ${lifetime}`);
		const newKey = generateJwkKeyPair(lifetime === 'short' ? 'prime256v1' : 'secp521r1');

		const [createdKey] = await this.db('signing_keys')
			.insert({
				id: newKey.keyId,
				lifetime,
				x_component: newKey.xComponent.toString('base64url'),
				y_component: newKey.yComponent.toString('base64url'),
				private_key: newKey.privateKey,
				public_key: newKey.publicKey,
				created_at: new Date(),
			})
			.returning('*');

		await this.addLog({
			ip: 'system',
			userAgent: 'system',
			userId: 'system',
			signingKeyId: createdKey?.id ?? null,
			status: createdKey ? 'success' : 'failed',
			errorMessage: createdKey ? undefined : 'Failed to create key',
			action: 'created',
		});

		if (!createdKey) {
			this.logger.error('Failed to create key');
			throw new Error('Failed to create key');
		}

		this.logger.info(`Key with id ${createdKey.id} created`);

		return createdKey;
	}

	private async deleteKey(id: string) {
		await this.addLog({
			ip: 'system',
			userAgent: 'system',
			userId: 'system',
			signingKeyId: id,
			status: 'success',
			action: 'deleted',
		});

		return this.db('signing_keys').where({ id }).delete();
	}

	private async addLog({
		action,
		status,
		ip,
		userAgent,
		userId,
		signingKeyId,
		errorMessage,
	}: {
		action?: signing_key_log_action;
		errorMessage?: string;
		ip: string;
		signingKeyId: string | null;
		status: signing_key_log_status;
		userAgent: string;
		userId: string;
	}) {
		await this.db.table('signing_keys_logs').insert({
			id: this.snowflake.generate(),
			status,
			action: action ?? 'requested-for-signing',
			ip_address: ip,
			user_agent: userAgent,
			user_id: userId,
			signing_key_id: signingKeyId,
			error_message: errorMessage,
		});
	}

	private async ipExceedsLimit(ip: string): Promise<boolean> {
		const { REQUESTS, WINDOW } = CONFIG.KEYS.KEY_SIGN_RATE_LIMIT.IP;

		const requests = await this.db
			.table('signing_keys_logs')
			.where('ip_address', ip)
			.where('created_at', '>', TimeSpan.fromNow().subtract(WINDOW).toIsoString())
			.count('* as count')
			.first();

		return requests.count >= REQUESTS;
	}

	private async ipAndUserIdExceedsLimit(ip: string, userId: string): Promise<boolean> {
		const { REQUESTS, WINDOW } = CONFIG.KEYS.KEY_SIGN_RATE_LIMIT.IP_AND_USER_ID;

		const requests = await this.db
			.table('signing_keys_logs')
			.where('ip_address', ip)
			.where('user_id', userId)
			.where('created_at', '>', TimeSpan.fromNow().subtract(WINDOW).toIsoString())
			.count('* as count')
			.first();

		return requests.count >= REQUESTS;
	}
}
