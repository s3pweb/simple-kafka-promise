/* eslint @typescript-eslint/no-unused-vars: 0 */

import { ClientMetrics, Message, Metadata, TopicPartitionOffset, WatermarkOffsets } from 'node-rdkafka';
import { KafkaConsumerInterface } from '../lib/kafkaConsumerInterface';

export class KafkaConsumerMock implements KafkaConsumerInterface {
  constructor(config: any, timeoutMs?: number) {
    // -- Empty
  }

  connect(topics): Promise<Metadata> {
    return Promise.resolve(null);
  }

  disconnect(): Promise<ClientMetrics> {
    return Promise.resolve(null);
  }

  subscribe(topics: string[]) {
    return null;
  }

  commit(): Promise<TopicPartitionOffset[]> {
    return Promise.resolve(null);
  }

  commitOffset(
    topicPartition: TopicPartitionOffset | TopicPartitionOffset[] | null,
  ): Promise<TopicPartitionOffset[]> {
    return Promise.resolve([]);
  }

  commitMessage(msg: TopicPartitionOffset): Promise<TopicPartitionOffset[]> {
    return Promise.resolve([]);
  }

  listen(numberOfMessages: number, autoCommit: boolean): Promise<Message[]> {
    return Promise.resolve([]);
  }

  getOffsets(topic: string, partition: number): Promise<WatermarkOffsets> {
    return Promise.resolve({ highOffset: 100, lowOffset: 0 });
  }
}
