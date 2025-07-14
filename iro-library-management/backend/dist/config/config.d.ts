interface Config {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    MONGODB_TEST_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE: string;
    EMAIL_HOST: string;
    EMAIL_PORT: number;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    FRONTEND_URL: string;
    ADMIN_FRONTEND_URL: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    MAX_FILE_SIZE: number;
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map