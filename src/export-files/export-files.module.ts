import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportFile } from './entities/export-file.entity';
import { ExportFilesController } from './export-files.controller';
import { ExportFilesService } from './export-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExportFile])],
  controllers: [ExportFilesController],
  providers: [ExportFilesService],
  exports: [ExportFilesService],
})
export class ExportFilesModule {}
