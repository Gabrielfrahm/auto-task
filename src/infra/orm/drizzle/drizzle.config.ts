import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });
export default {
	schema: "./src/infra/orm/drizzle/schemas/*",
	out: "./src/infra/orm/drizzle/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: "postgresql://task-db:task-db@localhost:5432/task-db",
	},
	verbose: true,
	strict: true,
} satisfies Config;

