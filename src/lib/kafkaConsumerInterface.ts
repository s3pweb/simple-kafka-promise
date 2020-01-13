export interface KafkaConsumerInterface {

  /**
   * Connect consumer to kafka and subscribe to given topics
   * @param topics Array of topics
   */
  connect(topics): Promise<object>;

  /**
   * Disconnect the consumer from Kafka.
   * @return The consumer metrics.
   */
  disconnect(): Promise<object>;

  /**
   * Subscribe to a new array of topics
   * @param topics Array of topics
   */
  subscribe(topics: string[]);

  /**
   * @return node-rdkafka topicPartitions
   */
  commit(): Promise<any>;

  /**
   * @param numberOfMessages
   * @param autoCommit
   * @return Consumed messages
   */
  listen(numberOfMessages: number, autoCommit: boolean): Promise<object[]>;
}
