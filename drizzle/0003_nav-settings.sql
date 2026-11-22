CREATE TABLE "nav_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
