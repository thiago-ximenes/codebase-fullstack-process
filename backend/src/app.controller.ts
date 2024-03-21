import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/upload-sheet')
  @UseInterceptors(FileInterceptor('file'))
  async getSheet(
    @UploadedFile(
      new ParseFilePipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new FileTypeValidator({
            fileType: 'sheet|csv',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.processFile(file);
  }
}
