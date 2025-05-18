/**
 * Environment configuration utility
 */
export const config = {
  isIntegrationTest: process.env.INTEGRATION_TEST === 'true',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
};

/**
 * Helper function to get environment specific values
 */
export function getEnvValue<T>(values: {
  test?: T;
  development?: T;
  production?: T;
  default: T;
}): T {
  if (config.isTest && values.test !== undefined) {
    return values.test;
  }
  if (config.isDevelopment && values.development !== undefined) {
    return values.development;
  }
  if (config.isProduction && values.production !== undefined) {
    return values.production;
  }
  return values.default;
}

/**
 * Network operation delays for different environments
 */
export const networkDelays = {
  scan: getEnvValue({
    test: 500,
    development: 1000,
    default: 0
  }),
  connect: getEnvValue({
    test: 2000,
    development: 0,
    default: 0
  }),
  forget: getEnvValue({
    test: 500,
    development: 0,
    default: 0
  })
};
