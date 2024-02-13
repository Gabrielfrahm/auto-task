import { TaskPresenter } from "@application/presenter/task/task.presenter";

import { Either } from "@shared/either";

export type GetTaskOutput = Either<Error, TaskPresenter>;
