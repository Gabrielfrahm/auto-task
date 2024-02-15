import { Task } from "@domain/task/task";
import { Repository } from "../../repository.interface";
import { Either } from "@shared/either";

export type SearchTaskParams = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: string;
  name?: string;
  description?: string;
}

export type List<E> = {
  data: E[],
  meta: {
    total: number,
    perPage: number,
    lastPage: number,
    totalPages: number
  }
}
export abstract class TaskRepositoryPort implements Repository<Task> {
	// constructor(private readonly _connection: Connection){}
  abstract create(entity: Task): Promise<Either<Error, Task>>;
  abstract findAll(params?:SearchTaskParams): Promise<Either<Error, List<Task>>>;
  abstract findByName(name: string): Promise<Either<Error, Task>>;
  abstract findById(id: string): Promise<Either<Error, Task>>
  abstract update(entity: Task): Promise<Either<Error, Task>>
  abstract findAllByDate(date: Date): Promise<Either<Error, Task[]>>
}
