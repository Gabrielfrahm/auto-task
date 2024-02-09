import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '@application/usecases/task/create/create-task-use-case';
import { CreateTaskValidator } from '@infra/adapters/validator/task.validator';

@Controller('tasks')
export class TaskRoute {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post('/')
  async createTask(@Body() data: CreateTaskValidator) {
    const output = await this.createTaskUseCase.execute(data);
    if (output.isLeft()) {
      throw new Error(output.value.message);
    }
    return output.value;
  }
}
