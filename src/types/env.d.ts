export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      OPEN_AI_API_KEY: string;
    }
  }
}
