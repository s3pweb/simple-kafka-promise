import { KafkaConsumerInterface } from '../lib/kafkaConsumerInterface';

export class KafkaConsumerMock implements KafkaConsumerInterface {
  constructor(config: object, timeoutMs?: number) {
    // -- Empty
  }

  connect(topics): Promise<any> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  disconnect(): Promise<any> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  subscribe(topics: string[]) {
    return null;
  }

  commit(): Promise<any[]> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  listen(numberOfMessages: number, autoCommit: boolean): Promise<any[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  getOffsets(topic: string, partition: number): Promise<any> {
    return new Promise((resolve) => {
      resolve({highOffset: 100, lowOffset: 0});
    });
  }
}
