import * as config from 'config';
import { HighLevelProducer } from 'node-rdkafka';

export class KafkaProducer {
  private log: any;
  private kafkaGlobalUuid: string;
  private connected: boolean;
  private readonly producerConfig: any;
  private readonly producer: any;

  constructor(container) {
    this.log = container.log.child
      ? container.log.child({child: 'KafkaHLProducer'})
      : container.log;
    this.kafkaGlobalUuid = 'KafkaProducerGlobalUuid';
    this.connected = false;

    this.producerConfig = {
      ...(config.get('kafka.producer.config')),
      ...{
        'socket.keepalive.enable': true,
        'request.required.acks': 1, // wait for leader ack
        'dr_cb': true,
      },
    };

    this.producer = new HighLevelProducer(this.producerConfig, {});

    this.log.trace(`Creating kafka producer.\n${JSON.stringify(this.producerConfig)}`);
  }

  connect(uuid: string): Promise<null> {
    this.kafkaGlobalUuid = uuid;

    return new Promise((resolve, reject) => {
      this.log.trace({uuid: this.kafkaGlobalUuid}, 'Starting Kafka producer');

      if (this.producer && this.connected === true) {
        this.log.trace({uuid: this.kafkaGlobalUuid}, 'Kafka already connected');
        resolve();
      } else {
        this.producer.setValueSerializer((v) => v);
        this.producer.setKeySerializer((v) => v);

        this.log.trace({uuid: this.kafkaGlobalUuid}, `Creating producer.\n${JSON.stringify(this.producerConfig)}`);

        this.producer.on('event.throttle', (throttle) => {
          this.log.trace('throttle', throttle);
        });

        this.producer.on('event.log', (log) => {
          const notDisplay = ['TOPPAR', 'APIVERSION'];

          if (notDisplay.indexOf(log.fac) === -1) {
            this.log.trace(`Event log: ${JSON.stringify(log)}`);
          }
        });

        this.producer.connect(
          null,
          (err, metadata) => {
            if (err) {
              this.log.warn({uuid: this.kafkaGlobalUuid, err}, 'Producer error while connecting');
              reject(err);
            } else {
              this.log.trace(JSON.stringify(metadata, null, 2));
              this.log.trace({uuid: this.kafkaGlobalUuid}, 'Kafka producer ready');
              this.connected = true;
              resolve();
            }
          },
        );
      }
    });
  }

  disconnect(): Promise<null> {
    return new Promise((resolve) => {
      this.log.trace({uuid: this.kafkaGlobalUuid}, 'Try to disconnecting producer');

      this.producer.poll();

      this.producer.disconnect();

      this.producer.once('disconnected', (arg) => {
        this.log.trace({uuid: this.kafkaGlobalUuid}, 'producer disconnected. ' + JSON.stringify(arg));

        this.connected = false;

        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
  }

  /**
   * Send a message to Kafka and await ack.
   *
   * @param topic
   * @param message
   * @param partition
   * @param key
   * @param uid
   */
  sendMessage(topic: string, message: string, partition: number, key: any, uid: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const fullTopic = (config.get('kafka.producer.topicsPrefix') ? config.get('kafka.producer.topicsPrefix') : '') + topic;

      this.log.trace({uuid: uid}, `Sending message to ${fullTopic}`);

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
