import { Module } from '@nestjs/common';
import { Cloudinary } from 'cloudinary-core';
import { v2 } from 'cloudinary/lib/cloudinary';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: new CloudinaryStorage({
          cloudinary: v2,
          params: {
            folder: 'my-folder',
            // format: async (_, __, cb) => cb(null, 'jpg'),
            public_id: (_, file) => file.originalname.split('.')[0],
          },
        }),
      }),
    }),
  ],
  providers: [
    {
      provide: Cloudinary,
      useValue: v2.config({
        cloud_name: 'your-cloud-name',
        api_key: 'your-api-key',
        api_secret: 'your-api-secret',
      }),
    },
  ],
  exports: [Cloudinary],
})
export class CloudinaryModule {}
