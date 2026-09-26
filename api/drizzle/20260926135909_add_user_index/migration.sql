ALTER TABLE "user_providers" ADD CONSTRAINT "user_providers_provider_provider_uid_unique" UNIQUE("provider","provider_uid");--> statement-breakpoint
CREATE INDEX "idx_user_providers_provider_uid" ON "user_providers" ("provider_uid");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" ("email");