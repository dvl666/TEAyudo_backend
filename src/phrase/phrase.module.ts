import { Module } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { Phrase } from './entities/phrase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Phrase])],
  controllers: [PhraseController],
  providers: [PhraseService],
})
export class PhraseModule {}
