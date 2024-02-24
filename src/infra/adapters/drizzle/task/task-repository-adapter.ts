import { List, SearchTaskParams, TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { Task, TaskProps } from "@domain/task/task";
import { Either, left, right } from "@shared/either";
import { InfraException } from "@shared/errors/infra.error";

import { and, count, desc, eq, like, sql } from "drizzle-orm";

import { DrizzleConnection } from "infra/orm/drizzle/connection";
import { tasks } from "infra/orm/drizzle/schemas/task";


export class PersistenceTask extends TaskRepositoryPort {

	constructor(private readonly drizzleConnection : DrizzleConnection){
		super();
		this.drizzleConnection = drizzleConnection;
	}

	async create(entity: Task): Promise<Either<Error, Task>> {
		try {
			const checkTask = await this.checkTaskNameAlreadyExiste(entity.getName());
			if(checkTask.isLeft()){
				throw checkTask.value;
			}
			await this.drizzleConnection.db.transaction(async(tx) => {

				await tx.insert(tasks).values({
					id: entity.getId(),
					name: entity.getName(),
					description: entity.getDescription(),
					start_date: entity.getStartDate(),
					finish_date: entity.getFinishDate(),
					created_at: entity.getCreatedAt()
				}).prepare("create-task").execute();
			});

			return right(entity);
		}catch(err){
			if (err instanceof InfraException) {

				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}


	async findAll(params?: SearchTaskParams): Promise<Either<Error, List<Task>>> {
		console.log(params);
		try {
			const offset = ((params?.page ||  1) - 1)  * (params?.per_page ?? 10);
			const limit = params?.per_page || 10;
			console.log(params.start_at);
			const taskModel = await this.drizzleConnection.db.select()
				.from(tasks)
				.where(
					and(
						params?.name && like(tasks.name, `%${params.name}%`),
						params?.description &&  like(tasks.description, `%${params.description}%`),
						// params?.created_at &&  (sql`DATE(start_date) = ${params.created_at}`)
						params?.start_at &&  (sql`DATE(tasks.start_date - INTERVAL '3 hours') = ${params.start_at}`)
					)
				)
				.limit(limit)
				.offset(offset)
				.orderBy(desc(tasks.created_at)).prepare("find-all-task").execute();

			const totalTasksCountResult = await this.drizzleConnection.db.select({ value: count() })
				.from(tasks)
				.where(
					and(
						params?.name && like(tasks.name, `%${params.name}%`),
						params?.description && like(tasks.description, `%${params.description}%`),
						// params?.created_at &&  (sql`DATE(start_date) = ${params.created_at}`)
						params?.start_at &&  (sql`DATE(tasks.start_date - INTERVAL '3 hours') = ${params.start_at}`)
					)
				).prepare("count-task").execute();


			const totalTasks = totalTasksCountResult[0].value || 0;
			const totalPages = Math.ceil(totalTasks / limit);
			const lastPage = Math.ceil(taskModel.length / limit);

			return right({
				data: taskModel.map((item: TaskProps) => {

					console.log(new Intl.DateTimeFormat(
						"pt-BR", {
							timeZone: "America/Sao_Paulo",
							dateStyle: "short",
							timeStyle: "medium"
						}).format(item.start_date));

					return Task.create({...item});
				}),
				meta: {
					total: totalTasks,
					perPage:  limit,
					lastPage,
					totalPages
				}
			});

		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}

	async findByName(name: string): Promise<Either<Error, Task>> {
		try{
			const taskModel = await this.getTaskByName(name);
			if(taskModel.isLeft()) {
				throw taskModel.value;
			}

			return right(taskModel.value);
		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}

	async findById(id: string): Promise<Either<Error, Task>> {
		try{
			const taskModel = await this.drizzleConnection.db.select().from(tasks).where(
				(eq(tasks.id, id))
			).prepare("check-task").execute();

			if(taskModel.length <= 0){
				return left(new InfraException("not found task", 404));
			}

			return right(Task.create(taskModel[0]));
		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}

	async update(entity: Task): Promise<Either<Error, Task>>{
		try{
			const checkTask = await this.checkTaskNameAlreadyExiste(entity.getName(), entity.getId());
			if(checkTask.isLeft()){
				throw checkTask.value;
			}
			await this.drizzleConnection.db.transaction(async(tx) => {
				await tx.update(tasks)
					.set({
						name: entity.getName(),
						description : entity.getDescription(),
						start_date: entity.getStartDate(),
						finish_date: entity.getFinishDate(),
					})
					.where(eq(tasks.id, entity.getId()))
					.prepare("update-task").execute();
			});
			return right(entity);
		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}

	async findAllByDate(date: Date): Promise<Either<Error, Task[]>> {
		try {
			const taskModel = await this.drizzleConnection.db.select()
				.from(tasks)
				.where(sql`DATE(tasks.start_date - INTERVAL '3 hours') = ${date}`)
				.orderBy(desc(tasks.created_at)).prepare("find-all-by-date").execute();

			return right(taskModel.map((item: TaskProps) => Task.create(item)));

		}catch(err){

			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new InfraException(error.message, 400));
			}
		}
	}

	private async getTaskByName(name : string) : Promise<Either<Error,Task>>{
		const taskModel = await this.drizzleConnection.db.select().from(tasks).where(
			(eq(tasks.name, name))
		).prepare("get-task-by-name").execute();

		if(taskModel.length <= 0){
			return left(new InfraException("not found task", 404));
		}

		return right(Task.create(taskModel[0]));
	}

	private async checkTaskNameAlreadyExiste(name: string, id?: string): Promise<Either<Error, null>> {
		const taskModel = await this.drizzleConnection.db.select().from(tasks).where(
			(eq(tasks.name, name))
		).prepare("check-task-already-existe").execute();

		if(id) {
			if(taskModel.length > 0 && taskModel[0].id === id) {
				return left(new InfraException("task already existing", 404));
			}
		}

		if(taskModel.length > 0){
			return left(new InfraException("task already existing", 404));
		}

		return right(null);
	}
}
