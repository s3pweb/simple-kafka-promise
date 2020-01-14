import { KafkaProducerInterface } from '../lib/kafkaProducerInterface';

export class KafkaProducerMock implements KafkaProducerInterface {
  constructor(config: object, topicPrefix?: string) {
  }

  connect(): Promise<object | null> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  disconnect(): Promise<object> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  sendMessage(topic: string, message: object, partition: number, key: any): Promise<number> {
    return new Promise((resolve) => {
      resolve(0);
    });
  }
}
