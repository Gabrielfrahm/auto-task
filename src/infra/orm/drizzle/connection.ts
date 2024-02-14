
import { Connection } from "@shared/connection.contract";

import * as dotenv from "dotenv";
import { Pool } from "pg";
import { NodePgClient, NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import  {tasks} from "../drizzle/schemas/task";
import { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";

dotenv.config({ path: "../../../.env" });


type TaskColumns = {
  id: PgColumn<{ name: "id"; tableName: "tasks"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; enumValues: [string, ...string[]]; baseColumn: never; }, object, object>;
  name: PgColumn<{ name: "name"; tableName: "tasks"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; enumValues: [string, ...string[]]; baseColumn: never; }, object, object>;
  description: PgColumn<{ name: "description"; tableName: "tasks"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; enumValues: [string, ...string[]]; baseColumn: never; }, object, object>;
  start_date: PgColumn<{ name: "start_date"; tableName: "tasks"; dataType: "date"; columnType: "PgTimestamp"; data: Date; driverParam: string; notNull: false; hasDefault: true; enumValues: undefined; baseColumn: never; }, object, object>;
  finish_date: PgColumn<{ name: "finish_date"; tableName: "tasks"; dataType: "date"; columnType: "PgTimestamp"; data: Date; driverParam: string; notNull: false; hasDefault: false; enumValues: undefined; baseColumn: never; }, object, object>;
  created_at: PgColumn<{ name: "created_at"; tableName: "tasks"; dataType: "date"; columnType: "PgTimestamp"; data: Date; driverParam: string; notNull: false; hasDefault: true; enumValues: undefined; baseColumn: never; }, object, object>;
};

type TaskTable = PgTableWithColumns<{ name: "tasks"; schema: undefined, columns: TaskColumns , dialect: "pg"}>;

type DatabaseSchema = {
  tasks: TaskTable;
};

export class DrizzleConnection implements Connection {

	private static instance: DrizzleConnection;
	public db: NodePgDatabase<DatabaseSchema>;
	public client: NodePgClient;
	public constructor() {
		this.client = new Pool({
			connectionString: process.env.DATABASE_URL
		});

		this.client.connect();

		this.db = drizzle(this.client, { schema: {tasks}, logger: true });
	}

	public static getInstance(): DrizzleConnection {
		if (!DrizzleConnection.instance) {
			DrizzleConnection.instance = new DrizzleConnection();
		}
		return DrizzleConnection.instance;
	}

	async connection(): Promise<unknown> {
		return this.db;
	}

	async close(): Promise<unknown> {
		return this.client;
	}
}

