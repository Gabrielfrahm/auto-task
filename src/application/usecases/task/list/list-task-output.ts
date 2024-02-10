import { List } from "@domain/port/out/persistence/task/task-repository.port";

import { Either } from "@shared/either";

export type ListTaskOutput = Either<Error, List<unknown>>;
