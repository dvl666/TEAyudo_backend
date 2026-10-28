import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PictogramModule } from 'src/pictogram/pictogram.module';
import { InfantModule } from 'src/infant/infant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => PictogramModule),
    forwardRef(() => InfantModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
