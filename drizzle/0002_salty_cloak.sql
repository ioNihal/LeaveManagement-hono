ALTER TABLE "employees" ADD COLUMN "status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;