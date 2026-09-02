import { Module } from '@nestjs/common';
import { PictogramService } from './pictogram.service';
import { PictogramController } from './pictogram.controller';
import { Pictogram } from './entities/pictogram.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Infant } from '../infant/entities/infant.entity';
import { StorageModule } from '../storage/storage.module';
import { User } from '../user/entities/user.entity';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { InfantModule } from 'src/infant/infant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pictogram]),
    StorageModule,
    CategoryModule,
    UserModule,
    InfantModule,
  ],
  controllers: [PictogramController],
  providers: [PictogramService],
})
export class PictogramModule {}
