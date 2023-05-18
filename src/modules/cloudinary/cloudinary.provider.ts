import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: 'dmam1b0az',
      api_key: '156712679745416',
      api_secret: 'grET8eh1DsASuroOxuYF7WoNIXs',
    });
  },
};
