import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateTaskUseCase } from '@application/usecases/task/create/create-task-use-case';
import { ListTaskUseCase } from '@application/usecases/task/list/list-task-use-case';
import { GetTaskUseCase } from '@application/usecases/task/get/get-task-use-case';
import { UpdateTaskUseCase } from '@application/usecases/task/update/update-task-use-case';
import { GeneratePdfUseCase } from '@application/usecases/task/generate-pdf/generate-pdf-use-case';

import { CreateTaskValidator } from '@infra/adapters/validator/task/create-task.validator';
import { UpdateTaskValidator } from '@infra/adapters/validator/task/update-task.validator';

import { SearchTaskParams } from '@domain/port/out/persistence/task/task-repository.port';
import { Response } from 'express';

@Controller('tasks')
export class TaskRoute {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTaskUseCase: ListTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly generatePdfUseCase: GeneratePdfUseCase,
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
      throw output.value;
    }
    return output.value;
  }

  @Patch('/:id')
  async updateTaskByName(
    @Param('id') id: string,
    @Body() data: UpdateTaskValidator,
  ) {
    const output = await this.updateTaskUseCase.execute({
      id: id,
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      finish_date: data.finish_date,
    });

    if (output.isLeft()) {
      throw output.value;
    }

    return output.value;
  }

  @Get('/generate/pdf/:date')
  async generatePdf(@Param('date') date: string, @Res() res: Response) {
    console.log(date);
    const output = await this.generatePdfUseCase.execute({
      date: new Date(date),
    });

    if (output.isLeft()) {
      throw output.value;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="your-pdf-name.pdf"',
    );

    res.send(Buffer.from(output.value));
  }
}
