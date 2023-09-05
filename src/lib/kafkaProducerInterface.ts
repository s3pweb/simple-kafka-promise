import { ClientMetrics, Metadata } from 'node-rdkafka';

export interface KafkaProducerInterface {
  /**
   * Connect the producer to kafka, will return broker's metadata or nothing if already connected.
   *
   * @return Broker's metadata
   */
  connect(): Promise<Metadata>;

  /**
   * Disconnect the producer from Kafka.
   *
   * @return The producer metrics.
   */
  disconnect(): Promise<ClientMetrics>;

  /**
   * Send a message to Kafka and await ack.
   *
   * @param topic Topic to send message to.
   * If `kafka.producer.topicsPrefix` exist in config, the full topic will be `kafka.producer.topicsPrefix + topic`
   * @param message Message to be sent (will be parsed with `JSON.stringify(...)` before).
   * @param partition Topic partition.
   * @param key Kafka key to be sent along the message.
   * @return Message's offset
   */
  sendMessage(
    topic: string,
    message: any,
    partition: number,
    key: any,
  ): Promise<number>;

  /**
   * Send a buffer message to Kafka and await ack.
   *
   * @param topic Topic to send message to.
   * If `kafka.producer.topicsPrefix` exist in config, the full topic will be `kafka.producer.topicsPrefix + topic`
   * @param message Message to be sent.
   * @param partition Topic partition.
   * @param key Kafka key to be sent along the message.
   * @return Message's offset
   */
  sendBufferMessage(
    topic: string,
    message: any,
    partition: number,
    key: any,
  ): Promise<number>;

  /**
   * Get metadata for a given topic.
   *
   * @param topic Topic name, if topic name is null all topics will be shown.
   * @param timeout Timeout in milliseconds.
   */
  getMetadata(topic: string, timeout?: number): Promise<Metadata>;
}
