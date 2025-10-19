import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    // inejct uploadToAwsProvider
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    // inject configService
    private readonly configService: ConfigService,
    // inject uploadsRepository
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // throw error for unsupported type
    if (
      !['image/gif', 'image/png', 'image/jpeg', 'image/jpg'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not support');
    }

    try {
      // upload to the file to aws s3
      const name = await this.uploadToAwsProvider.fileUpload(file);
      // generate to a new entry in database
      const uploadFile: UploadFile = {
        name: name,
        mime: file.mimetype,
        path: `https://${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
        size: file.size,
        type: fileTypes.IMAGE,
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
