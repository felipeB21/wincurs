ALTER TYPE "public"."subscription_status" ADD VALUE 'incomplete';--> statement-breakpoint
ALTER TYPE "public"."subscription_status" ADD VALUE 'incomplete_expired';--> statement-breakpoint
ALTER TYPE "public"."subscription_status" ADD VALUE 'unpaid';