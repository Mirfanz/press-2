declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
  }
}
