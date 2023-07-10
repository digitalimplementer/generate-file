import * as fs from 'fs';
import { join } from 'path';
import { IconDto } from 'src/categories/dtos/icon.dto';

export const saveImage = (file: IconDto) => {
  const originalname = file.originalname.split('.');
  const filename = +new Date() + '.' + originalname[originalname.length - 1];
  const dir = 'public/icons';

  !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

  const stream = fs.createWriteStream(
    join(
      `public/icons`,

      filename,
    ),
  );
  stream.write(file.buffer);
  stream.end();

  return filename;
};

export const removeImage = (filename: string) => {
  const filePath = `public/files/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
      return;
    }
    console.log(`File was successfully deleted`);
  });
};
