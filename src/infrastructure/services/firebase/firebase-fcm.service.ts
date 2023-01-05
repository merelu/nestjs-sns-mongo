import { Injectable } from '@nestjs/common';
import {
  getMessaging,
  MulticastMessage,
  TokenMessage,
  TopicMessage,
} from 'firebase-admin/messaging';
import {
  initializeApp,
  getApps,
  App,
  ServiceAccount,
  cert,
} from 'firebase-admin/app';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { FirebaseConfig } from '@domain/config/firebase.interface';
import { ILogger } from '@domain/logger/logger.interface';
import { IFirebaseFcmService } from '@domain/adapters/firebase-fcm.interface';

@Injectable()
export class FirebaseFcmService implements IFirebaseFcmService {
  private readonly app: App;
  private readonly fcmMessage: Messaging;

  constructor(
    private readonly firebaseConfig: FirebaseConfig,
    private readonly logger: ILogger,
  ) {
    const firebaseAdminConfig: ServiceAccount = {
      projectId: firebaseConfig.getFirebaseProjectId(),
      privateKey: firebaseConfig.getFirebasePrivateKey(),
      clientEmail: firebaseConfig.getFirebaseClientEmail(),
    };

    if (!this.app && getApps().length === 0) {
      if (process.env.NODE_ENV !== 'local') {
        this.app = initializeApp({
          credential: cert(firebaseAdminConfig),
          databaseURL: `https://${firebaseAdminConfig.projectId}.firebaseio.com`,
        });
      } else {
        this.app = initializeApp({
          credential: cert(firebaseAdminConfig),
          databaseURL: `https://${firebaseAdminConfig.projectId}.firebaseio.com`,
        });
      }
    } else {
      this.app = getApps()[0];
    }

    this.fcmMessage = getMessaging(this.app);
  }

  async sendNotification(
    message: TokenMessage,
    silent?: boolean,
  ): Promise<string> {
    let result = null;
    try {
      result = await this.fcmMessage.send(message, silent);
    } catch (error) {
      this.logger.error('Fcm', error.message, error.stackTrace);
      throw error;
    }
    return result;
  }

  async sendToMulti(message: MulticastMessage, silent?: boolean) {
    const result = await this.fcmMessage.sendMulticast(message, silent);

    if (result.failureCount > 0) {
      const failedTokens: string[] = [];

      result.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(message.tokens[idx]);
        }
        this.logger.debug('Fcm', 'Failed Token list' + failedTokens);
      });
    }
  }

  async sendToTopic(
    topic: 'all' | string,
    message: TopicMessage,
    silent: boolean,
  ) {
    if (!topic && topic.trim().length === 0) {
      throw new Error('You provide an empty topic name!');
    }

    let result = null;
    try {
      result = await this.fcmMessage.send(message, silent);
    } catch (error) {
      this.logger.error('Fcm', error.message, error.stackTrace);
      throw error;
    }
    return result;
  }
}
