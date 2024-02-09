import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

type taskId = string;

export const tasks = pgTable("tasks", {
	id: text("id").$type<taskId>().primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	start_date: text("start_date").default(sql`CURRENT_TIMESTAMP`),
	finish_date: text("finish_date"),
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const insertTask = createInsertSchema(tasks);
export type taskModel = typeof tasks.$inferSelect;
