import {ClientMetrics, Message, Metadata, TopicPartitionOffset, WatermarkOffsets} from 'node-rdkafka';
import {KafkaConsumerInterface} from '../lib/kafkaConsumerInterface';

export class KafkaConsumerMock implements KafkaConsumerInterface {
  constructor(config: object, timeoutMs?: number) {
    // -- Empty
  }

  connect(topics): Promise<Metadata> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  disconnect(): Promise<ClientMetrics> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  subscribe(topics: string[]) {
    return null;
  }

  commit(): Promise<TopicPartitionOffset[]> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  listen(numberOfMessages: number, autoCommit: boolean): Promise<Message[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  getOffsets(topic: string, partition: number): Promise<WatermarkOffsets> {
    return new Promise((resolve) => {
      resolve({highOffset: 100, lowOffset: 0});
    });
  }
}
