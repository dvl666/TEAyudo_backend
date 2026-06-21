import { Module } from '@nestjs/common';
import { InfantService } from './infant.service';
import { InfantController } from './infant.controller';
import { Infant } from './entities/infant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Infant])],
  controllers: [InfantController],
  providers: [InfantService],
})
export class InfantModule {}
