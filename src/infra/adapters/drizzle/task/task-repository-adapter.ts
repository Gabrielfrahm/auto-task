import { SearchUsersParams, TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { Task } from "@domain/task/task";
import { Either, left, right } from "@shared/either";
import { DrizzleConnection } from "infra/orm/drizzle/connection";
import { tasks } from "infra/orm/drizzle/schemas/task";

export class PersistenceTask extends TaskRepositoryPort {

	constructor(private readonly drizzleConnection : DrizzleConnection){
		super();
		this.drizzleConnection = drizzleConnection;
	}

	async create(entity: Task): Promise<Either<Error, Task>> {
		try {

			await this.drizzleConnection.db.transaction(async(tx) => {
				await tx.insert(tasks).values({
					id: entity.getId(),
					name: entity.getName(),
					description: entity.getDescription(),
					start_date: entity.getStartDate(),
					finish_date: entity.getFinishDate(),
					created_at: entity.getCreatedAt()
				}).prepare().execute();
			});

			return right(entity);
		}catch(err){
			const error = err as {message:string};
			return left(new Error(error.message));
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async findAll(params?: SearchUsersParams): Promise<Either<Error, Task[]>> {
		throw new Error("Method not implemented.");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async findByName(name: string): Promise<Either<Error, Task>> {
		throw new Error("Method not implemented.");
	}
}
