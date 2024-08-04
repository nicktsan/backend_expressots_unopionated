import { ENV } from "../../../../src/env";
/**
 * Configuration of the database pool.
 */
export const postgres_pool_config = {
    host: ENV.DB.DB_HOST,
    port: ENV.DB.DB_PORT,
    user: ENV.DB.DB_USER,
    password: ENV.DB.DB_PASSWORD,
    database: ENV.DB.DB_NAME,
};
