import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './controller/media.controller';

@Module({
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
