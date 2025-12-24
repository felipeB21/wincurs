CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'trialing');--> statement-breakpoint
CREATE TABLE "cursor_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"cursor_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cursor_download" (
	"id" text PRIMARY KEY NOT NULL,
	"cursor_id" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cursor_like" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cursor_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cursor_like_user_cursor_unique" UNIQUE("user_id","cursor_id")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"product_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "subscription_status" NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_subscription_id_unique" UNIQUE("subscription_id")
);
--> statement-breakpoint
ALTER TABLE "cursor_comment" ADD CONSTRAINT "cursor_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursor_comment" ADD CONSTRAINT "cursor_comment_cursor_id_cursor_id_fk" FOREIGN KEY ("cursor_id") REFERENCES "public"."cursor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursor_download" ADD CONSTRAINT "cursor_download_cursor_id_cursor_id_fk" FOREIGN KEY ("cursor_id") REFERENCES "public"."cursor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursor_download" ADD CONSTRAINT "cursor_download_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursor_like" ADD CONSTRAINT "cursor_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursor_like" ADD CONSTRAINT "cursor_like_cursor_id_cursor_id_fk" FOREIGN KEY ("cursor_id") REFERENCES "public"."cursor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cursor_comment_userId_idx" ON "cursor_comment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cursor_comment_cursorId_idx" ON "cursor_comment" USING btree ("cursor_id");--> statement-breakpoint
CREATE INDEX "cursor_download_cursorId_idx" ON "cursor_download" USING btree ("cursor_id");--> statement-breakpoint
CREATE INDEX "cursor_download_userId_idx" ON "cursor_download" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cursor_like_userId_idx" ON "cursor_like" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cursor_like_cursorId_idx" ON "cursor_like" USING btree ("cursor_id");--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "subscription" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_status_idx" ON "subscription" USING btree ("status");