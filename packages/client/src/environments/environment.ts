import type { Environment } from './types';

export const ENVIRONMENT: Environment = {
  IS_PRODUCTION: false,
  IS_HOMOLOGATION: false,
  IS_DEVELOPMENT: true,
  API: {
    GRAPHQL: 'http://localhost:3000/graphql',
    REST: 'http://localhost:3000/api',
    WELL_KNOWN: 'http://localhost:3000/meta/.well-known',
  },
} as const;
