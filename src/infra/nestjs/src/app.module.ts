import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './module/task.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
