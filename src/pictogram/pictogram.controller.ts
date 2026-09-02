import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePictogramDto } from './dtos/create-pictogram.dto';
import { PictogramService } from './pictogram.service';
import type { PictogramImageFile } from './pictogram.service';

@Controller('pictogram')
export class PictogramController {
  constructor(private readonly pictogramService: PictogramService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPictogramDto: CreatePictogramDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: PictogramImageFile,
  ) {
    return this.pictogramService.create(createPictogramDto, file);
  }

  @Get()
  findAll() {
    return this.pictogramService.findAll();
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    return this.pictogramService.findByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pictogramService.findOne(id);
  }
}
