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
import { CreatePictogramDto } from './dtos/create-pictogram.dto';
import { PictogramService } from './pictogram.service';
import type { PictogramImageFile } from './pictogram.service';
import { UpdatePictogramDto } from './dtos/update-pictogram.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ValidFields } from './interfaces/valid-fields.interface';
import { Belongs } from '../decorators/belongs/belongs.decorator';

@Controller( 'pictogram' )
export class PictogramController {
  constructor(private readonly pictogramService: PictogramService) 
  {}
  
  @Post()
  @Auth( ValidRoles.USER )
  @UseInterceptors(FileInterceptor( 'file' ))
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
    return this.pictogramService.create( createPictogramDto, file );
  }
  
  @Get()
  @Auth( ValidRoles.ADMIN )
  findAll() {
    return this.pictogramService.findAllPublic();
  }
  
  @Get(':infantId')
  @Belongs( ValidFields.INFANT_ID )
  @Auth( ValidRoles.USER )
  findPictogramsByInfantId( @Param( 'infantId', new ParseUUIDPipe() ) infantId: string ) {
    return this.pictogramService.findPublicAndPersonalPictograms( infantId );
  }
  
  @Get( '/search/pictogram/:pictogramId' )
  @Belongs( ValidFields.PICTOGRAM_ID )
  @Auth( ValidRoles.USER )
  findOne(@Param( 'pictogramId', new ParseUUIDPipe() ) pictogramId: string ) {
    console.log( 'Finding pictogram with ID:', pictogramId );
    return this.pictogramService.findOne( pictogramId );
  }

  @Get('category/:categoryId')
  @Auth( ValidRoles.USER )
  findByCategory(@Param( 'categoryId', new ParseUUIDPipe() ) categoryId: string ) {
    return this.pictogramService.findByCategory( categoryId );
  }
  
  @Get('tutor/:tutorId')
  @Belongs( ValidFields.TUTOR_ID )
  @Auth( ValidRoles.USER )
  findAllByTutorId(@Param( 'tutorId', new ParseUUIDPipe() ) tutorId: string ) {
    return this.pictogramService.findAllByTutorId( tutorId );
  }

  @Patch(':pictogramId')
  @Belongs( ValidFields.PICTOGRAM_ID )
  @Auth( ValidRoles.USER )
  update(
    @Param('pictogramId', new ParseUUIDPipe()) pictogramId: string,
    @Body() updatePictogramDto: UpdatePictogramDto,
  ) {
    return this.pictogramService.update( pictogramId, updatePictogramDto );
  }

  @Patch(':pictogramId/image')
  @Belongs( ValidFields.PICTOGRAM_ID )
  @Auth( ValidRoles.USER )
  @UseInterceptors( FileInterceptor(' file' ) )
  updateImage(
    @Param( 'pictogramId', new ParseUUIDPipe() ) pictogramId: string,
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
    return this.pictogramService.updateImage( pictogramId, file );
  }

}
