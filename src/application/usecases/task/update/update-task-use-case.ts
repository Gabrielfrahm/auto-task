import { UseCase } from "@application/usecases/use-case.interface";
import { UpdateTaskCommand } from "./update-task-command";
import { UpdateTaskOutput } from "./update-task-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { left, right } from "@shared/either";
import { ApplicationException } from "@shared/errors/application.error";
import { TaskPresenter } from "@application/presenter/task/task.presenter";

export class UpdateTaskUseCase implements UseCase<UpdateTaskCommand, UpdateTaskOutput> {
	constructor(private readonly taskRepository: TaskRepositoryPort){
		this.taskRepository = taskRepository;
	}

	async execute(command: UpdateTaskCommand): Promise<UpdateTaskOutput> {
		try{
			const task = await this.taskRepository.findById(command.id);
			if(task.isLeft()){
				throw new Error(task.value.message);
			}

			task.value.update(command);

			const updatedTask = await this.taskRepository.update(task.value);

			if(updatedTask.isLeft()){
				throw new Error(updatedTask.value.message);
			}

			return right(TaskPresenter.ToPresenter(task.value));
		}catch(err) {
			return left(new ApplicationException(err["message"], 400));
		}
	}
}
