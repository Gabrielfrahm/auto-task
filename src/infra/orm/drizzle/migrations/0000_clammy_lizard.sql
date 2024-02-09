CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start_date" text DEFAULT CURRENT_TIMESTAMP,
	"finish_date" text DEFAULT CURRENT_TIMESTAMP,
	"created_at" text DEFAULT CURRENT_TIMESTAMP
);
