import { Task } from "@domain/task/task";
import { Repository } from "../../repository.interface";
import { Either } from "@shared/either";

export interface SearchUsersParams {
  page?: number;
  per_page?: number;
  name?: string;
  email?: string;
}

export abstract class TaskRepositoryPort implements Repository<Task> {
	// constructor(private readonly _connection: Connection){}
  abstract create(entity: Task): Promise<Either<Error, Task>>;
  abstract findAll(params?:SearchUsersParams): Promise<Either<Error,Task[]>>;
  abstract findByName(name: string): Promise<Either<Error, Task>>;
}
