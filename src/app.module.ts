import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { ExportFile } from './export-files/entities/export-file.entity';
import { ExportFilesModule } from './export-files/export-files.module';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';

import { Service } from './services/entities/service.entity';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.HOST_DATABASE}`,
      port: 3306,
      username: `${process.env.USERNAME_DATABASE}`,
      password: `${process.env.PASSWORD_DATABASE}`,
      database: `${process.env.DATABASE}`,
      entities: [Category, Service, Order, ExportFile],
      synchronize: true,
    }),
    OrdersModule,
    CategoriesModule,
    ServicesModule,
    ExportFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
