CREATE TYPE "public"."movement_type" AS ENUM('transfer', 'maintenance', 'loan', 'write-off');--> statement-breakpoint
CREATE TABLE "moving_equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"origin_space_id" uuid,
	"destination_space_id" uuid,
	"movement_type" "movement_type" NOT NULL,
	"description" text,
	"movement_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "moving_equipment" ADD CONSTRAINT "moving_equipment_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moving_equipment" ADD CONSTRAINT "moving_equipment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moving_equipment" ADD CONSTRAINT "moving_equipment_origin_space_id_spaces_id_fk" FOREIGN KEY ("origin_space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moving_equipment" ADD CONSTRAINT "moving_equipment_destination_space_id_spaces_id_fk" FOREIGN KEY ("destination_space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;