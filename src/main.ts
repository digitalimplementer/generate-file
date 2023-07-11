import * as dotenv from 'dotenv';
import { resolve } from 'path';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config({ path: resolve('../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
