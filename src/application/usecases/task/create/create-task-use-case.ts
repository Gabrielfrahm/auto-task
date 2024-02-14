import { left, right } from "@shared/either";
import { UseCase } from "@application/usecases/use-case.interface";
import { CreateTaskCommand } from "./create-task-command";
import { Task } from "@domain/task/task";
import { CreateTaskOutput } from "./create-task-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { ApplicationException } from "@shared/errors/application.error";
import { TaskPresenter } from "@application/presenter/task/task.presenter";
import { InfraException } from "@shared/errors/infra.error";

export class CreateTaskUseCase implements UseCase<CreateTaskCommand, CreateTaskOutput> {

	public constructor(private readonly taskRepository : TaskRepositoryPort) {
		this.taskRepository = taskRepository;
	}

	async execute(command: CreateTaskCommand): Promise<CreateTaskOutput> {
		try {
			const repositoryResult = await this.taskRepository.create(Task.create(command));
			if(repositoryResult.isLeft()){
				throw new Error(repositoryResult.value.message);
			}
			return right(TaskPresenter.ToPresenter(repositoryResult.value));
		}catch(err){
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new ApplicationException(error.message, 400));
			}
		}
	}
}
