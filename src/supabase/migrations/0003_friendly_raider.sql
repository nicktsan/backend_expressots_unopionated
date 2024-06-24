ALTER TABLE "user" ADD COLUMN "password_hash" text NOT NULL;--> statement-breakpoint


ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");--> statement-breakpoint


ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");

-- Change minimum password length to 8 in supabase prod
-- Change Email template for sign up in supabase prod
-- Configure Site URLs and Redirect URLS in supabase prod
-- Configure SMTP settings in Resend and Supabase for prod