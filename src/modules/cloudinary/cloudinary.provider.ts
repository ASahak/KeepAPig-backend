import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  inject: [ConfigService],
  useFactory: (configService) => {
    return v2.config({
      cloud_name: configService.get('cloudinary.cloudName'),
      api_key: configService.get('cloudinary.apiKey'),
      api_secret: configService.get('cloudinary.apiSecret'),
    });
  },
};
