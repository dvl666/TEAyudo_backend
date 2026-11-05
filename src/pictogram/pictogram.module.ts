import { Module } from '@nestjs/common';
import { PictogramService } from './pictogram.service';
import { PictogramController } from './pictogram.controller';
import { Pictogram } from './entities/pictogram.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { InfantModule } from 'src/infant/infant.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pictogram]),
    StorageModule,
    CategoryModule,
    UserModule,
    InfantModule,
    AuthModule,
    AuthorizationModule
  ],
  controllers: [PictogramController],
  providers: [PictogramService],
  exports: [PictogramService],
})
export class PictogramModule {}
