import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  Patch,
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
import { UpdateInfantDto } from './dtos/update-infant.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Authorization } from 'src/authorization/decorators/authorization/authorization.decorator';
import { AccessType } from 'src/authorization/interfaces/access-type.interface';

@Controller('infant')
export class InfantController {
  constructor(private readonly infantService: InfantService) {}

  @Auth( ValidRoles.ADMIN )
  @Get()
  findAll(): Promise<Infant[]> {
    return this.infantService.findAll();
  }

  @Auth( ValidRoles.USER )
  @Post()
  create(@Body() createInfantDto: CreateInfantDto): Promise<Infant> {
    return this.infantService.create(createInfantDto);
  }

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Patch(':infantId')
  update(
    @Param( 'infantId', new ParseUUIDPipe() ) infantId: string,
    @Body() updateInfantDto: UpdateInfantDto,
  ): Promise<Infant> {
    return this.infantService.update( infantId, updateInfantDto );
  }

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Post(':infantId/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param( 'infantId', new ParseUUIDPipe() ) infantId: string,
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
    return this.infantService.uploadAvatar( infantId, file );
  }

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Patch( ':infantId/avatar' )
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @Param( 'infantId', new ParseUUIDPipe() ) infantId: string,
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
    return this.infantService.uploadAvatar( infantId, file) ;
  }


}
