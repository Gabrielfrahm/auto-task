import { UseCase } from "@application/usecases/use-case.interface";
import { ListTaskCommand } from "./list-task-command";
import { ListTaskOutput } from "./list-task-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { left, right } from "@shared/either";
import { ApplicationException } from "@shared/errors/application.error";
import { TaskPresenter } from "@application/presenter/task/task.presenter";
import { InfraException } from "@shared/errors/infra.error";

export class ListTaskUseCase implements UseCase<ListTaskCommand, ListTaskOutput> {

	public constructor(private readonly taskRepository : TaskRepositoryPort) {
		this.taskRepository = taskRepository;
	}

	async execute(command: ListTaskCommand): Promise<ListTaskOutput> {
		try {
			const repositoryResult = await this.taskRepository.findAll(command);
			if(repositoryResult.isLeft()){
				throw new Error(repositoryResult.value.message);
			}
			return right({
				data: repositoryResult.value.data.map((item) => TaskPresenter.ToPresenter(item)),
				meta: repositoryResult.value.meta
			});

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
