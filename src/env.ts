export const ENV = {
    CORS: {
        FRONTEND_ORIGIN: String(
            process.env.FRONTEND_ORIGIN || "localhost:3000",
        ),
    },
    DB: {
        DATABASE_URL: String(process.env.DATABASE_URL),
        DB_HOST: String(process.env.DB_HOST),
        DB_NAME: String(process.env.DB_NAME),
        DB_PORT: Number(process.env.DB_PORT),
        DB_USER: String(process.env.DB_USER),
        DB_PASSWORD: String(process.env.DB_PASSWORD),
    },
    SUPABASE: {
        SUPABASE_URL: String(process.env.SUPABASE_URL),
        SUPABASE_PUBLIC_ANON_KEY: String(process.env.SUPABASE_PUBLIC_ANON_KEY),
    },
};
