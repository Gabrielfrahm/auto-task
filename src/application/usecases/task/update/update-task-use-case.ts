import { UseCase } from "@application/usecases/use-case.interface";
import { UpdateTaskCommand } from "./update-task-command";
import { UpdateTaskOutput } from "./update-task-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { left, right } from "@shared/either";
import { ApplicationException } from "@shared/errors/application.error";
import { TaskPresenter } from "@application/presenter/task/task.presenter";
import { InfraException } from "@shared/errors/infra.error";

export class UpdateTaskUseCase implements UseCase<UpdateTaskCommand, UpdateTaskOutput> {
	constructor(private readonly taskRepository: TaskRepositoryPort){
		this.taskRepository = taskRepository;
	}

	async execute(command: UpdateTaskCommand): Promise<UpdateTaskOutput> {
		try{
			console.log(typeof command.finish_date);
			const task = await this.taskRepository.findById(command.id);

			if(task.isLeft()){
				throw task.value;
			}

			task.value.update(command);

			const updatedTask = await this.taskRepository.update(task.value);

			if(updatedTask.isLeft()){
				throw updatedTask.value;
			}

			return right(TaskPresenter.ToPresenter(task.value));
		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new ApplicationException(error.message, 400));
			}
		}
	}
}
