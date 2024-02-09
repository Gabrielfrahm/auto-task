
import { Connection } from "@shared/connection.contract";

import * as dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import  {tasks} from "../drizzle/schemas/task";

dotenv.config({ path: "../../../.env" });
export class DrizzleConnection implements Connection {

	private static instance: DrizzleConnection;
	public db;
	public client;
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
		return this.client.end();
	}
}

