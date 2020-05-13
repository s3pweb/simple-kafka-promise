import { WatermarkOffsets } from 'node-rdkafka';
import { KafkaConsumerInterface } from '../lib/kafkaConsumerInterface';

export class KafkaConsumerMock implements KafkaConsumerInterface {
  constructor(config: object, timeoutMs?: number) {
    // -- Empty
  }

  connect(topics): Promise<object> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  disconnect(): Promise<object> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  subscribe(topics: string[]) {
    return null;
  }

  commit(): Promise<any> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  listen(numberOfMessages: number, autoCommit: boolean): Promise<object[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  getOffsets(topic: string): Promise<WatermarkOffsets> {
    return new Promise((resolve) => {
      resolve({highOffset: 100, lowOffset: 0});
    });
  }
}
