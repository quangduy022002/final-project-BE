/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const serviceAccount = require('./../../src/task-management-43b18-firebase-adminsdk-4zoxg-e4adf7600c.json');
    if (!getApps().length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'task-management-43b18.appspot.com',
      });
    }
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
