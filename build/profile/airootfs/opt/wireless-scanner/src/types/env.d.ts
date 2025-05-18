declare global {
  namespace NodeJS {
    interface ProcessEnv {
      INTEGRATION_TEST?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      // Add other env variables here
    }
  }
}
