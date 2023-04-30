import { Stream } from 'stream';

export interface ErrorInterfaceHttpException {
  error: string;
  statusCode: number;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
