import { UseCase } from "@application/usecases/use-case.interface";
import { GetTaskCommand } from "./get-task-command";
import { GetTaskOutput } from "./get-task-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { left, right } from "@shared/either";
import { TaskPresenter } from "@application/presenter/task/task.presenter";
import { ApplicationException } from "@shared/errors/application.error";
import { InfraException } from "@shared/errors/infra.error";

export class GetTaskUseCase implements UseCase<GetTaskCommand, GetTaskOutput> {

	constructor(private readonly taskRepository: TaskRepositoryPort){
		this.taskRepository = taskRepository;
	}

	async execute(command: GetTaskCommand): Promise<GetTaskOutput> {
		try {
			const repositoryResult = await this.taskRepository.findByName(command.name);
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
