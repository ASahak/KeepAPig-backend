import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadImage(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return v2.uploader.upload(filePath, {
      public_id: Date.now().toString(),
      resource_type: 'image',
    });
  }
}
