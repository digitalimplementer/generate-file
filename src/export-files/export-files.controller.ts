import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ExportFile } from './entities/export-file.entity';
import { ExportFilesService } from './export-files.service';

@Controller('export-files')
export class ExportFilesController {
  constructor(private readonly exportFilesService: ExportFilesService) {}

  @Get()
  async findAll(): Promise<ExportFile[]> {
    return await this.exportFilesService.findAll();
  }

  @Get(':id')
  async byId(@Param('id') id: number): Promise<ExportFile | null> {
    return await this.exportFilesService.byId(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.exportFilesService.delete(id);
  }
}
