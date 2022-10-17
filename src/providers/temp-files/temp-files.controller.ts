import { v4 as uuidv4 } from 'uuid'
import { diskStorage } from 'multer';
import { Body, Controller, Get, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FileManager } from '../file-manager';
import { TempFile } from './temp-files.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// const upload = multer({
//   dest: '/tmp',
//   limits: {
//     fileSize: 50 * 1024 * 1024,
//   }
// });

@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: '/tmp', 
    filename(req, file, cb) {
      // Generating a 32 random chars long string
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
      //Calling the callback passing the random name generated with the original extension name
      cb(null, `${randomName}${extname(file.originalname)}`)
    }
  })
}))
@Controller('temp-files')
export class TempFilesController {

  constructor(
    private fm: FileManager,

    @InjectModel(TempFile.name)
    private temp_file_model: Model<TempFile>,
  ) {}

  @Post()
  async upload(@UploadedFile() file): Promise<TempFile> {
    const new_path = 'tmp/' + uuidv4();

    await this.fm.putFile(new_path, file.path);

    return await this.temp_file_model.create({
      name: file.originalname,
      meta: {
        mimetype: file.mimetype,
        encoding: file.encoding,
        size: file.size
      },
      path: new_path,
    });
  }
}
