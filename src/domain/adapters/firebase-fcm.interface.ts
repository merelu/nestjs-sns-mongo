import {
  MulticastMessage,
  TokenMessage,
  TopicMessage,
} from 'firebase-admin/messaging';

export interface IFirebaseFcmService {
  sendNotification(message: TokenMessage, silent?: boolean): Promise<string>;
  sendToMulti(message: MulticastMessage, silent?: boolean): Promise<void>;
  sendToTopic(
    topic: 'all' | string,
    message: TopicMessage,
    silent: boolean,
  ): Promise<string>;
}
