import { removeImage } from 'src/helpers/storing-images';
import { Repository } from 'typeorm';
import { json2xml } from 'xml-js';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDto } from './dtos/file.dto';
import { ExportFile } from './entities/export-file.entity';
import { FileFormatEnum } from './enums/export-file-format.enum';

@Injectable()
export class ExportFilesService {
  constructor(
    @InjectRepository(ExportFile)
    private readonly exportFileRepository: Repository<ExportFile>,
  ) {}

  async findAll(): Promise<ExportFile[]> {
    return await this.exportFileRepository.find();
  }

  async byId(id: number): Promise<ExportFile | null> {
    const foundFile = await this.exportFileRepository.findOne({
      where: { id: id },
    });

    if (!foundFile) {
      throw Error('error');
    }

    return foundFile;
  }

  async generate(data: FileDto) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    //  eslint-disable-next-line @typescript-eslint/no-var-requires
    const csvjson = require('csvjson');

    const dir = 'public/files';

    !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

    if (!FileFormatEnum[data.format]) {
      throw new BadRequestException('Invalid file format');
    }

    const writeStream = fs.createWriteStream(`${dir}/${data.filename}`);

    switch (data.format) {
      case FileFormatEnum.csv:
        writeStream.write(
          csvjson.toCSV(data.result, {
            delimiter: ',',
            wrap: false,
          }),
        );
        break;

      case FileFormatEnum.xml:
        writeStream.write(
          json2xml(JSON.stringify(data.result), {
            compact: true,
            spaces: 4,
          }),
        );
        break;

      case FileFormatEnum.json:
        writeStream.write(`${JSON.stringify(data.result)}`);
        break;

      default:
        throw new BadRequestException('Error in writing to the file');
    }

    writeStream.end();

    await this.exportFileRepository.insert({ ...data });
    return data.result;
  }

  async delete(id: number) {
    const foundFile = await this.byId(id);

    removeImage(foundFile.filename);
    return await this.exportFileRepository.delete(id);
  }
}
