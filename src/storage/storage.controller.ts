import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(file);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: String,
  })
  @Get(':id')
  async getLink(@Param('id', ParseIntPipe) id) {
    return this.storageService.getLink(id);
  }
}
