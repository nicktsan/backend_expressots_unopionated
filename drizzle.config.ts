import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { ENV } from "./src/env"

config({ path: '.env' });

export default defineConfig({
  schema: './src/supabase/migrations/schema.ts',
  out: './src/supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DB.DATABASE_URL!,
  },
});
