import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

interface UploadedFileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file?: UploadedFileData) {
    if (!file) throw new BadRequestException('El campo file es obligatorio');
    return this.storageService.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Get(':key/url')
  async getUrl(@Param('key') key: string) {
    return { url: await this.storageService.getSignedUrl(key) };
  }

  @Delete(':key')
  delete(@Param('key') key: string) {
    return this.storageService.delete(key);
  }
}
