import { Snowflake } from '@sapphire/snowflake';
import { CONFIG } from '../../config.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Snowflake');

export class SnowflakeGenerator {
	private static instance: SnowflakeGenerator;

	public static getInstance(): SnowflakeGenerator {
		return this.instance ?? (this.instance = new SnowflakeGenerator());
	}

	private readonly epoch: number = CONFIG.SNOWFLAKE.EPOCH;

	private readonly machineId: bigint;

	private readonly generator = new Snowflake(this.epoch);

	private constructor() {
		const now = performance.now();
		this.machineId = BigInt(String(Math.floor(now)).slice(-5));

		logger.debug(
			`Created Snowflake generator with epoch ${this.epoch} and machineId ${this.machineId}`,
		);
	}

	public generate(): bigint {
		return this.generator.generate({
			processId: this.machineId,
		});
	}
}
