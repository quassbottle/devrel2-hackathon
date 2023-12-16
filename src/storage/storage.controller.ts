import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FileUploadedDto } from './dto/file-uploaded.dto';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOkResponse({
    type: FileUploadedDto
  })
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

  @ApiOkResponse({
    type: FileUploadedDto
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: String,
  })
  @Get(':id')
  async getLink(@Param('id', ParseIntPipe) id) {
    const candidate = await this.storageService.file({ id });

    if (candidate == null) {
      throw new HttpException('File not found', 404);
    }

    return candidate.url;
  }
}
