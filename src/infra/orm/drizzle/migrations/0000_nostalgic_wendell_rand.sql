CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"finish_date" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
