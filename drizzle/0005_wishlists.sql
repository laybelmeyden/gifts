CREATE TABLE "wishlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"occasion" text DEFAULT 'just' NOT NULL,
	"cover" text DEFAULT 'gift' NOT NULL,
	"event_date" date,
	"visibility" text DEFAULT 'link' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "wishlist_id" uuid;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wishlists_owner_created_idx" ON "wishlists" USING btree ("owner_id","created_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_wishlist_id_wishlists_id_fk" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gifts_wishlist_idx" ON "gifts" USING btree ("wishlist_id");