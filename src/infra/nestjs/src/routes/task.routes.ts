import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateTaskUseCase } from '@application/usecases/task/create/create-task-use-case';
import { ListTaskUseCase } from '@application/usecases/task/list/list-task-use-case';
import { GetTaskUseCase } from '@application/usecases/task/get/get-tas-use-case';

import { CreateTaskValidator } from '@infra/adapters/validator/task.validator';
import { SearchTaskParams } from '@domain/port/out/persistence/task/task-repository.port';

@Controller('tasks')
export class TaskRoute {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTaskUseCase: ListTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
  ) {}

  @Post('/')
  async createTask(@Body() data: CreateTaskValidator) {
    const output = await this.createTaskUseCase.execute(data);
    if (output.isLeft()) {
      throw new Error(output.value.message);
    }
    return output.value;
  }

  @Get()
  async findAllTasks(@Query() searchTaskParams: SearchTaskParams) {
    const output = await this.listTaskUseCase.execute(searchTaskParams);
    if (output.isLeft()) {
      throw new Error(output.value.message);
    }
    return output.value;
  }

  @Get('/:name')
  async findTaskByName(@Param('name') name: string) {
    const output = await this.getTaskUseCase.execute({ name });
    if (output.isLeft()) {
      throw new Error(output.value.message);
    }
    return output.value;
  }
}
