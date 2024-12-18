import type { JwtClaims } from '../../routes/well-known/enums.js';

export type JwtPayload<T extends JwtClaims = JwtClaims> = Partial<
	Record<T, number | string | null>
>;
