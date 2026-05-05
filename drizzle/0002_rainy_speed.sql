CREATE TYPE "public"."space_status" AS ENUM('active', 'maintenance', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."conservation_status" AS ENUM('new', 'good', 'regular', 'maintenance', 'downloaded');--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" "space_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"manufacturer" varchar(100),
	"model" varchar(100),
	"serial_number" varchar(100) NOT NULL,
	"category" varchar(100),
	"conservation_status" "conservation_status" DEFAULT 'new' NOT NULL,
	"space_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipments_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;