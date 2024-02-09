import { Task } from "@domain/task/task";
import { Either } from "@shared/either";

export type CreateTaskOutput = Either<Error, Task>;
