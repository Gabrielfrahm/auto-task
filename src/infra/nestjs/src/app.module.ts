import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleConnection } from '../../orm/drizzle/connection';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './module/task.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TaskModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'drizzleConnection',
      useFactory: async () => {
        return DrizzleConnection.getInstance();
      },
    },
  ],
})
export class AppModule {}
