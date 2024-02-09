import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

type taskId = string;

export const tasks = pgTable("tasks", {
	id: text("id").$type<taskId>().primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	start_date: timestamp("start_date").default(sql`CURRENT_TIMESTAMP`),
	finish_date: timestamp("finish_date"),
	created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const insertTask = createInsertSchema(tasks);
export type taskModel = typeof tasks.$inferSelect;
