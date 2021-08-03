import {KafkaProducerInterface} from '../lib/kafkaProducerInterface';
import {ClientMetrics, Metadata} from 'node-rdkafka';

export class KafkaProducerMock implements KafkaProducerInterface {
  constructor(config: object, topicPrefix?: string) {
    // -- Empty
  }

  connect(): Promise<Metadata> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  disconnect(): Promise<ClientMetrics> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  sendMessage(topic: string, message: object, partition: number, key: any): Promise<number> {
    return new Promise((resolve) => {
      resolve(0);
    });
  }

  getMetadata(topic?: string, timeout?: number): Promise<Metadata> {
    return Promise.resolve(undefined);
  }
}
