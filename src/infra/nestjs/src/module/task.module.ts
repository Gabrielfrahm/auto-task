import { Module } from '@nestjs/common';

import { DrizzleConnection } from 'infra/orm/drizzle/connection';
import { TaskRoute } from '../routes/task.routes';
import { PersistenceTask } from 'infra/adapters/drizzle/task/task-repository-adapter';
import { CreateTaskUseCase } from '@application/usecases/task/create/create-task-use-case';
import { TaskRepositoryPort } from '@domain/port/out/persistence/task/task-repository.port';
import { ListTaskUseCase } from '@application/usecases/task/list/list-task-use-case';
import { GetTaskUseCase } from '@application/usecases/task/get/get-task-use-case';
import { UpdateTaskUseCase } from '@application/usecases/task/update/update-task-use-case';

@Module({
  imports: [],
  controllers: [TaskRoute],
  providers: [
    {
      provide: 'drizzleConnection',
      useFactory: async () => {
        return DrizzleConnection.getInstance();
      },
    },
    {
      provide: 'taskRepositoryAdapter',
      useFactory: async (connection: DrizzleConnection) =>
        new PersistenceTask(connection),
      inject: ['drizzleConnection'],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new CreateTaskUseCase(taskRepository),
      inject: ['taskRepositoryAdapter'],
    },
    {
      provide: ListTaskUseCase,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new ListTaskUseCase(taskRepository),
      inject: ['taskRepositoryAdapter'],
    },
    {
      provide: GetTaskUseCase,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new GetTaskUseCase(taskRepository),
      inject: ['taskRepositoryAdapter'],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new UpdateTaskUseCase(taskRepository),
      inject: ['taskRepositoryAdapter'],
    },
  ],
})
export class TaskModule {}
