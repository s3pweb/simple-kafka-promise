import { HighLevelProducer } from 'node-rdkafka';

export class KafkaProducer {
  private connected: boolean;
  private readonly prefix: string;
  private readonly producer: HighLevelProducer;

  /**
   *
   * @param config Node-rdkafka configuration object. Minimum: `{ "metadata.broker.list": "0.0.0.0:9094" }`
   * @param topicPrefix Prefix to add before each topic name
   */
  constructor(config: object, topicPrefix?: string) {
    this.connected = false;
    this.prefix = topicPrefix ? topicPrefix : '';

    const producerConfig = {
      ...config,
      ...{
        'socket.keepalive.enable': true,
        'request.required.acks': 1, // wait for leader ack
        'dr_cb': true,
      },
    };

    this.producer = new HighLevelProducer(producerConfig, {});
  }

  /**
   * Connect the producer to kafka, will return broker's metadata or nothing if already connected.
   * @return Broker's metadata
   */
  connect(): Promise<object | null> {
    return new Promise((resolve, reject) => {
      if (this.producer && this.connected === true) {
        // Do nothing if we are already connected
        resolve();
      } else {
        // Fix for https://github.com/Blizzard/node-rdkafka/issues/600
        this.producer.setValueSerializer((v) => v);
        this.producer.setKeySerializer((v) => v);

        this.producer.connect(
          null,
          (err, metadata) => {
            if (err) {
              reject(err);
            } else {
              this.connected = true;
              resolve(metadata);
            }
          },
        );
      }
    });
  }

  /**
   * Poll then disconnect hte producer from Kafka.
   *
   * @return The producer metrics.
   */
  disconnect(): Promise<object> {
    return new Promise((resolve, reject) => {
      this.producer.disconnect(((err, data) => {
        this.connected = false;

        if (err) {
          // Should not happen
          reject(err);
        } else {
          resolve(data);
        }
      }));
    });
  }

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
  sendMessage(topic: string, message: object, partition: number, key: any): Promise<number> {
    return new Promise((resolve, reject) => {
      // Create full topic
      const fullTopic = this.prefix + topic;

      // Send message to kafka
      this.producer.produce(
        fullTopic,
        partition,
        Buffer.from(JSON.stringify(message)),
        key,
        Date.now(),
        (err, offset) => {
          if (err) {
            reject(err);
          } else {
            resolve(offset);
          }
        });
    });
  }
}
