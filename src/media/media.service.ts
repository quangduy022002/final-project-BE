import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { format } from 'util';

@Injectable()
export class MediaService {
  storage: Storage;
  constructor() {
    this.storage = new Storage({
      keyFilename: path.join(__dirname, '../../../ploggvn-95aadc5076fd.json'),
      projectId: 'ploggvn',
    });
  }

  async upload(
    fileName: string,
    bucketName: string,
    buffer: Buffer,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const bucket = this.storage.bucket('ploggvn.appspot.com');
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );

        try {
          // Make the file public
          await bucket.file(fileName).makePublic();
        } catch (err) {
          reject(err);
        }

        resolve(publicUrl);
      });

      blobStream.end(buffer);
    });
  }

  async download(name: string) {
    return await this.storage
      .bucket('ploggvn.appspot.com')
      .file(name)
      .download();
  }
}
