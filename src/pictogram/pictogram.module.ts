import { Module } from '@nestjs/common';
import { PictogramService } from './pictogram.service';
import { PictogramController } from './pictogram.controller';
import { Pictogram } from './entities/pictogram.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pictogram])],
  controllers: [PictogramController],
  providers: [PictogramService],
})
export class PictogramModule {}
