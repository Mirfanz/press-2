declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    SALT_ROUNDS: string;
    NEXT_PUBLIC_SB_PUBLIC_KEY: string;
    NEXT_PUBLIC_SB_PROJECT_URL: string;
  }
}
