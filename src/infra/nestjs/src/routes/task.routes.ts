import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '@application/usecases/task/create/create-task-use-case';
import { CreateTaskCommand } from '@application/usecases/task/create/create-task-command';

@Controller('tasks')
export class TaskRoute {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post('/')
  async createTask(@Body() data: CreateTaskCommand) {
    const output = await this.createTaskUseCase.execute(data);
    if (output.isLeft()) {
      throw new Error(output.value.message);
    }
    return output.value;
  }
}
