ALTER TABLE "gifts" ADD COLUMN "category" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "desire" text DEFAULT 'want' NOT NULL;--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "cover" text DEFAULT 'gift' NOT NULL;--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "comment" text;