import { ClientMetrics, Metadata, Producer } from 'node-rdkafka';

export class KafkaNProducer {
  private connected: boolean;
  private indexMessage: number;
  private readonly prefix: string;
  private readonly producer: Producer;

  /**
   * @param config Node-rdkafka configuration object. Minimum: `{ "metadata.broker.list": "0.0.0.0:9094" }`
   * @param topicPrefix Prefix to add before each topic name
   */
  constructor(config: any, topicPrefix?: string) {
    this.indexMessage = 0;
    this.connected = false;
    this.prefix = topicPrefix ? topicPrefix : '';

    const producerConfig = {
      ...config,
      ...{
        'socket.keepalive.enable': true,
        dr_cb: true,
      },
    };

    this.producer = new Producer(producerConfig, {});
  }

  connect(): Promise<Metadata> {
    return new Promise((resolve, reject) => {
      if (this.producer && this.connected === true) {
        resolve(null);
      } else {
        this.producer.connect(null, (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            this.connected = true;
            resolve(metadata);
          }
        });
      }
    });
  }

  disconnect(): Promise<ClientMetrics> {
    return new Promise((resolve) => {
      this.producer.disconnect();

      this.producer.once('disconnected', () => {
        this.connected = false;
        setTimeout(() => {
          resolve(null);
        }, 2000);
      });
    });
  }

  sendMessage(topic, message, cpt, partition, key): void {
    // Create full topic
    const fullTopic = this.prefix + topic;

    this.producer.produce(
      fullTopic,
      partition,
      Buffer.from(JSON.stringify(message)),
      key,
      Date.now(),
      cpt,
    );
  }

  getMetadata(topic: string, timeout = 5000): Promise<Metadata> {
    // Get all topics or only the one in parameter
    const allTopics = !topic;
    return new Promise((resolve, reject) => {
      this.producer.getMetadata(
        { topic, timeout, allTopics },
        (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            resolve(metadata);
          }
        },
      );
    });
  }

  sendMessagesAndWaitReport(
    topic: string,
    messages: any[],
    partition: number,
    key: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let deliveryReportListener;
      let errorListener;

      try {
        const nbEvents = messages.length;

        const cptDelivery = 0;

        deliveryReportListener = (err, report) => {
          if (err) {
            reject(err);
          }

          // remove id from the list
          deliveryCheck = deliveryCheck.filter(
            (item) => item !== report.opaque,
          );

          if (deliveryCheck.length === 0) {
            clearTimeout(timeout);

            this.producer.removeListener(
              'delivery-report',
              deliveryReportListener,
            );
            this.producer.removeListener('event.error', errorListener);

            clearInterval(tt);

            resolve(null);
          }
        };

        this.producer.on('delivery-report', deliveryReportListener);

        errorListener = (error) => {
          this.producer.removeListener(
            'delivery-report',
            deliveryReportListener,
          );
          this.producer.removeListener('event.error', errorListener);

          reject(error);
        };

        this.producer.on('event.error', errorListener);

        let deliveryCheck = [];
        for (let index = 0; index < nbEvents; index++) {
          const message = messages[index];

          const id = this.indexMessage++;

          this.sendMessage(topic, message, id, partition, key);

          deliveryCheck.push(id);
        }

        const tt = setInterval(() => {
          this.producer.poll();
        }, 10);

        const timeout = setTimeout(() => {
          const message = `Kafka timeout while sending events!\nSend: ${cptDelivery}\nTotal: ${nbEvents}`;

          this.producer.removeListener(
            'delivery-report',
            deliveryReportListener,
          );
          this.producer.removeListener('event.error', errorListener);

          clearInterval(tt);
          reject(new Error(message));
        }, nbEvents * 60 + 15000);
      } catch (err) {
        this.producer.removeListener('delivery-report', deliveryReportListener);
        this.producer.removeListener('event.error', errorListener);
        reject(err);
      }
    });
  }
}
