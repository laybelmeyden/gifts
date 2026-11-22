CREATE TABLE "reservations" (
	"gift_id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"anonymous" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_gift_id_gifts_id_fk" FOREIGN KEY ("gift_id") REFERENCES "public"."gifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reservations_user_created_idx" ON "reservations" USING btree ("user_id","created_at" DESC NULLS LAST);