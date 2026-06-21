import { Module } from '@nestjs/common';
import { PhrasePictogramService } from './phrase-pictogram.service';
import { PhrasePictogramController } from './phrase-pictogram.controller';
import { PhrasePictogram } from './entities/phrase-pictogram.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PhrasePictogram])],
  controllers: [PhrasePictogramController],
  providers: [PhrasePictogramService],
})
export class PhrasePictogramModule {}
