export interface Environment {
  API: {
    GRAPHQL: string;
    REST: string;
    WELL_KNOWN: string;
  };
  IS_DEVELOPMENT: boolean;
  IS_HOMOLOGATION: boolean;
  IS_PRODUCTION: boolean;
}
