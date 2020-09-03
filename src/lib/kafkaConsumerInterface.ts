export interface KafkaConsumerInterface {

  /**
   * Connect consumer to kafka and subscribe to given topics
   * @param topics Array of topics
   */
  connect(topics): Promise<any>;

  /**
   * Disconnect the consumer from Kafka.
   * @return The consumer metrics.
   */
  disconnect(): Promise<any>;

  /**
   * Subscribe to a new array of topics
   * @param topics Array of topics
   */
  subscribe(topics: string[]);

  /**
   * Commit current client offsets
   * @return node-rdkafka topicPartitions
   */
  commit(): Promise<any[]>;

  /**
   * Listen to a number of messages
   * @param numberOfMessages
   * @param autoCommit
   * @return Consumed messages
   */
  listen(numberOfMessages: number, autoCommit: boolean): Promise<any[]>;

  /**
   * Get lowOffset and highOffset for given topic
   * @param topic
   * @param partition
   * @return Topic's offsets
   */
  getOffsets(topic: string, partition: number): Promise<any>;
}
