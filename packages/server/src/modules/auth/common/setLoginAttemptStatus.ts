import type { logins_attempts_statuses } from '../../../generated/database.types.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { DatabaseToken } from '../../../infra/database/createDatabase.js';

export async function setAuthAttemptStatus(
	status: logins_attempts_statuses,
	id: string,
	mfaAttemptId?: string,
) {
	const db = resolveToken(DatabaseToken);

	await db('logins_attempts').update({ status }).where({ id });

	if (mfaAttemptId) {
		await db('logins_attempts_mfas').update({ status }).where({ id: mfaAttemptId });
	}
}
