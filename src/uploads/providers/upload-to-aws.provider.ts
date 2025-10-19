import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('appConfig.awsBucketName')!;
    this.s3Client = new S3Client({
      region: this.configService.get<string>('appConfig.awsRegion'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'appConfig.awsAccessKeyId',
        )!,
        secretAccessKey: this.configService.get<string>(
          'appConfig.awsSecretAccessKey',
        )!,
      },
    });
  }

  public async fileUpload(file: Express.Multer.File) {
    const key = this.generateFileName(file);

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Body: file.buffer,
          Key: key,
          ContentType: file.mimetype,
        }),
      );

      return key;
    } catch (error) {
      throw new RequestTimeoutException(
        error instanceof Error ? error.message : error,
      );
    }
  }

  generateFileName(file: Express.Multer.File) {
    // extract file name
    let name = file.originalname.split('.')[0];
    // remove white space
    name.replace(/\s/g, '').trim();
    // extract the extension
    let extension = path.extname(file.originalname);
    // generate time stamp
    let timestamp = new Date().getTime().toString().trim();
    // return file uuid
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
