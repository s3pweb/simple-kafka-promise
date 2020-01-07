const Kafka = require('node-rdkafka')
const config = require('config')

let instance = null

class KafkaProducer {
  constructor (container) {
    this.log = container.log.child
      ? container.log.child({ child: 'KafkaHLProducer' })
      : container.log
    this.kafkaGlobalUuid = 'KafkaProducerGlobalUuid'
    this.connected = false

    this.producerConfig = {
      ...(container.config ? container.config : config.kafka.producer.config),
      ...{
        'socket.keepalive.enable': true,
        'request.required.acks': 1, // wait for leader ack
        dr_cb: true
      }
    }

    this.log.trace(`Creating kafka producer.\n${JSON.stringify(this.producerConfig)}`)

    this.indexMessage = 0
  }

  connect (uuid = require('uuid/v1')()) {
    this.kafkaGlobalUuid = uuid

    return new Promise((resolve, reject) => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Starting Kafka producer')

      if (this.producer && this.connected === true) {
        this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Kafka already connected')
        resolve()
      } else {
        this.producer = new Kafka.HighLevelProducer(this.producerConfig, {})

        this.producer.setValueSerializer(v => v)
        this.producer.setKeySerializer(v => v)

        this.log.trace({ uuid: this.kafkaGlobalUuid }, `Creating producer.\n${JSON.stringify(this.producerConfig)}`)

        this.log.trace('Kafka.features', Kafka.features)

        this.producer.on('event.throttle', throttle => {
          this.log.trace('throttle', throttle)
        })

        this.producer.on('event.log', log => {
          const notdisplay = ['TOPPAR', 'APIVERSION']

          if (notdisplay.indexOf(log.fac) === -1) {
            this.log.trace(`Event log: ${JSON.stringify(log)}`)
          }
        })

        this.producer.connect(
          null,
          (err, metadata) => {
            if (err) {
              this.log.warn({ uuid: this.kafkaGlobalUuid, err }, 'Producer error while connecting')
              reject(err)
            } else {
              this.log.trace(JSON.stringify(metadata, null, 3))
              this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Kafka producer ready')
              this.connected = true
              resolve()
            }
          }
        )
      }
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Try to disconnecting producer')

      this.producer.disconnect()

      this.producer.once('disconnected', arg => {
        this.log.trace({ uuid: this.kafkaGlobalUuid }, 'producer disconnected. ' + JSON.stringify(arg))

        this.connected = false

        setTimeout(() => {
          resolve()
        }, 2000)
      })
    })
  }

  sendMessage (topic, message, partition, key, uid) {
    return new Promise((resolve, reject) => {
      const fullTopic = (config.kafka.producer.topicsPrefix ? config.kafka.producer.topicsPrefix : '') + topic

      this.log.trace({ uuid: uid }, `Sending message to ${fullTopic}`)

      this.producer.produce(
        fullTopic,
        partition,
        Buffer.from(JSON.stringify(message)),
        key,
        Date.now(),
        (err, offset) => {
          if (err) {
            reject(err)
          } else {
            resolve(offset)
          }
        })
    })
  }
}

module.exports = container => {
  if (!container || !container.log) {
    console.error('Please provide a logger instance for kafka producer !')
    process.exit(1)
  } else {
    if (!instance) {
      instance = new KafkaProducer(container)
    }
  }

  return instance
}
