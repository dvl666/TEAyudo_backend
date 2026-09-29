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
import { InfantService } from './infant.service';
import { Infant } from './entities/infant.entity';
import { CreateInfantDto } from './dtos/create-infant.dto';
import type { InfantAvatarFile } from './infant.service';

@Controller('infant')
export class InfantController {
  constructor(private readonly infantService: InfantService) {}

  @Get()
  findAll(): Promise<Infant[]> {
    return this.infantService.findAll();
  }

  @Post()
  create(@Body() createInfantDto: CreateInfantDto): Promise<Infant> {
    return this.infantService.create(createInfantDto);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: InfantAvatarFile,
  ): Promise<Record<string, unknown>> {
    return this.infantService.uploadAvatar(id, file);
  }
}
