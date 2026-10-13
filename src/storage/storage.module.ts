import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { ModerationService } from './moderation.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, ModerationService],
  exports: [StorageService, ModerationService],
})
export class StorageModule {}
