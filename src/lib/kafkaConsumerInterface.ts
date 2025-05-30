import {
  ClientMetrics,
  KafkaConsumer as Consumer,
  Message,
  Metadata,
  TopicPartitionOffset,
  WatermarkOffsets,
} from 'node-rdkafka';

export interface KafkaConsumerInterface {
  /**
   * Connect consumer to kafka and subscribe to given topics
   * @param topics Array of topics
   */
  connect(topics): Promise<Metadata>;

  /**
   * Disconnect the consumer from Kafka.
   * @return The consumer metrics.
   */
  disconnect(): Promise<ClientMetrics>;

  /**
   * Subscribe to a new array of topics
   * @param topics Array of topics
   */
  subscribe(topics: string[]);

  /**
   * Commit current client offsets
   * @return node-rdkafka topicPartitions
   */
  commit(): Promise<TopicPartitionOffset[]>;

  /**
   * Commit given offset(s)
   * @param topicPartition a single or an array of TopicPartitionOffset(s)
   */
  commitOffset(
    topicPartition: TopicPartitionOffset | TopicPartitionOffset[] | null,
  ): Promise<TopicPartitionOffset[]>;

  /**
   * Commit given message (set topic offset at topic + 1)
   * @param msg
   */
  commitMessage(msg: TopicPartitionOffset): Promise<TopicPartitionOffset[]>;

  /**
   * Listen to a number of messages
   * @param numberOfMessages
   * @param autoCommit
   * @return Consumed messages
   */
  listen(numberOfMessages: number, autoCommit: boolean): Promise<Message[]>;

  /**
   * Get lowOffset and highOffset for given topic
   * @param topic
   * @param partition
   * @return Topic's offsets
   */
  getOffsets(topic: string, partition: number): Promise<WatermarkOffsets>;

  /**
   * @return Consumer instance from node-rdkafka
   */
  getConsumer(): Consumer;
}
