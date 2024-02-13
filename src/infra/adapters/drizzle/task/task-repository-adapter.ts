import { List, SearchTaskParams, TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { Task, TaskProps } from "@domain/task/task";
import { Either, left, right } from "@shared/either";
import { InfraException } from "@shared/errors/infra.error";
import { and, count, desc, eq, like } from "drizzle-orm";
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
			return left(new InfraException(error.message, 400));
		}
	}



	async findAll(params?: SearchTaskParams): Promise<Either<Error, List<Task>>> {
		try {
			const offset = ((params?.page ||  1) - 1)  * (params?.per_page ?? 10);
			const limit = params?.per_page || 10;

			const taskModel = await this.drizzleConnection.db.select()
				.from(tasks)
				.where(
					and(
						params?.name && like(tasks.name, `%${params.name}%`),
						params?.description &&  like(tasks.description, `%${params.description}%`)
					)
				)
				.limit(limit)
				.offset(offset)
				.orderBy(desc(tasks.created_at)).prepare().execute();

			const totalTasksCountResult = await this.drizzleConnection.db.select({ value: count() })
				.from(tasks)
				.where(
					and(
						params?.name && like(tasks.name, `%${params.name}%`),
						params?.description && like(tasks.description, `%${params.description}%`)
					)
				).prepare().execute();

			const totalTasks = totalTasksCountResult[0].value || 0;
			const totalPages = Math.ceil(totalTasks / limit);
			const lastPage = Math.ceil(taskModel.length / limit);

			return right({
				data: taskModel.map((item: TaskProps) => Task.create(item)),
				meta: {
					total: totalTasks,
					perPage:  limit,
					lastPage,
					totalPages
				}
			});

		}catch(err) {
			const error = err as {message:string};
			return left(new InfraException(error.message, 400));
		}
	}

	async findByName(name: string): Promise<Either<Error, Task>> {
		try{
			const taskModel = await this.drizzleConnection.db.select().from(tasks).where(
				(eq(tasks.name, name))
			).prepare().execute();

			if(taskModel.length <= 0){
				return left(new InfraException("not found task", 404));
			}


			return right(Task.create(taskModel[0]));
		}catch(err) {
			const error = err as {message:string};
			return left(new InfraException(error.message, 400));
		}
	}
}
