import { TaskPresenter } from "@application/presenter/task/task.presenter";
import { Either } from "@shared/either";

export type UpdateTaskOutput = Either<Error, TaskPresenter>;
