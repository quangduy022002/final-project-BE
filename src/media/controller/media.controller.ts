import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../media.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Media')
@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const data = Promise.all(
      files.map(async (file) => await this.mediaService.upload(file)),
    );
    return data;
  }
}
