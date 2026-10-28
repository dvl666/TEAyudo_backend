import { forwardRef, Module } from '@nestjs/common';
import { InfantService } from './infant.service';
import { InfantController } from './infant.controller';
import { Infant } from './entities/infant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { StorageModule } from 'src/storage/storage.module';
import { AuthModule } from 'src/auth/auth.module';
import { PictogramModule } from 'src/pictogram/pictogram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature( [Infant] ), 
    forwardRef( () => UserModule ),
    StorageModule,
    AuthModule,
    forwardRef( () => PictogramModule )
  ],
  controllers: [InfantController],
  providers: [InfantService],
  exports: [InfantService],
})
export class InfantModule {}
