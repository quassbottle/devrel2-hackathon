import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadedDto } from './dto/file-uploaded.dto';
import { Prisma, Image } from '@prisma/client';
import { createHash } from 'crypto';

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  bucket = process.env.S3_BUCKET_NAME;
  s3 = new AWS.S3({
    apiVersion: 'latest',
    endpoint: process.env.S3_ENDPOINT_URL,
    region: 'ru-msk',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  async file(where: Prisma.ImageWhereUniqueInput) : Promise<Image> {
    return this.prisma.image.findFirst({
      where
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<FileUploadedDto> {
    const { originalname } = file;

    const hashedName = createHash('md5').update(originalname).digest('hex').toString();

    if (file.size == 0) throw new HttpException('Empty file', 400);

    const s3 = await this.s3_upload(
      file.buffer,
      this.bucket,
      hashedName,
      file.mimetype,
    );


    const { res, uploaded } = s3;

    if (!uploaded) {
      return {
        id: null,
        title: null,
        type: null,
        uploaded: false,
        size: 0,
        url: null,
      }
    }

    const db = await this.prisma.image.create({
      data: {
        title: hashedName,
        type: file.mimetype,
        size: file.size,
        url: 'http://' + this.bucket + '.' + process.env.S3_ENDPOINT_URL + '/' + file.originalname,
      }
    });

    return {
      id: db.id,
      size: Number(db.size),
      type: db.type,
      title: db.title,
      uploaded: true,
      url: 'http://' + this.bucket + '.' + process.env.S3_ENDPOINT_URL + '/' + file.originalname,
    }
  }

  private async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return {
        res: s3Response,
        uploaded: true
      };
    } catch (e) {
      console.log(e);
      return {
        res: null,
        uploaded: false
      };
    }
  }
}
