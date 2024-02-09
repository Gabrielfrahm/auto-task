import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { EitherExceptionFilter } from './error-handler';
import { CustomValidationPipe } from './class-validator.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new EitherExceptionFilter(httpAdapterHost));

  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(3333);
}
bootstrap();
