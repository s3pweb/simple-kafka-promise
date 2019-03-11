const Kafka = require('node-rdkafka')
const config = require('config')

const Uuid = require('uuid/v4')

let instance = null

class KafkaConsumer {
  constructor (container) {
    this.log = container.log.getChild
      ? container.log.child({ child: 'KafkaConsumer' })
      : container.log

    this.kafkaGlobalUuid = 'KafkaConsumerGlobalUuid'

    const consumerConfig = {
      ...(container.config ? container.config : config.kafka.consumer.config),
      ...{
        'enable.auto.commit': false,
        'socket.keepalive.enable': true
      }
    }

    this.log.trace(`Creating kafka consumer.\n${JSON.stringify(consumerConfig)}`)

    this.consumer = new Kafka.KafkaConsumer(consumerConfig, {
      'auto.offset.reset': 'earliest'
    })
  }

  connect (topics, uuid = Uuid()) {
    // Kafka global uuid is the same as the server for ease of search
    this.kafkaGlobalUuid = uuid

    // Bus is ready and message(s) can be consumed
    this.consumer.on('ready', () => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Kafka consumer ready')
      // Get consume timeout from config (or 5 sec)
      let timeout = config.kafka.consumer.consumeTimeout ? config.kafka.consumer.consumeTimeout : 5000
      this.consumer.setDefaultConsumeTimeout(timeout)
      this.consumer.subscribe(topics)
    })

    this.consumer.on('event.stats', stats => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Stats on Kafka listener: ', stats)
    })

    this.consumer.on('event.throttle', throttle => {
      this.log.warn({ uuid: this.kafkaGlobalUuid }, 'Throttle on Kafka listener: ', throttle)
    })

    // Errors received from the bus
    this.consumer.on('event.error', error => {
      this.log.warn({ uuid: this.kafkaGlobalUuid, err: error }, `Error on Kafka listener: ${error.message}`)
    })

    return new Promise((resolve, reject) => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Starting Kafka consumer')

      this.consumer.connect(
        null,
        (err, metadata) => {
          if (err) {
            this.log.warn({ uuid: this.kafkaGlobalUuid, err }, 'Consumer error')
            return reject(err)
          } else {
            this.log.trace('metadata', metadata)
            this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Consumer connected')
            return resolve()
          }
        }
      )
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Disconnecting listener')
      this.consumer.disconnect((params, metrics) => {
        this.log.trace(
          { uuid: this.kafkaGlobalUuid },
          `Disconnected from listener.\nParams: ${JSON.stringify(params)}\nMetrics: ${JSON.stringify(metrics)}`
        )
        resolve()
      })
    })
  }

  subscribe (topics) {
    this.consumer.unsubscribe()
    this.consumer.subscribe(topics)
  }

  commit (args) {
    return new Promise((resolve, reject) => {
      this.consumer.commit()
      this.consumer.committed(undefined, 5000, (err, topicPartitions) => {
        if (err) {
          this.log.warn({ err: err, uuid: args.uuid ? args.uuid : this.kafkaGlobalUuid }, ' Fail to commit offsets')
          reject(err)
        } else {
          this.log.trace({
            uuid: args.uuid ? args.uuid : this.kafkaGlobalUuid,
            err
          }, 'Committed offset: ', topicPartitions)
          resolve()
        }
      })
    })
  }

  listen (args) {
    return new Promise((resolve, reject) => {
      if (!args) {
        reject(new Error('Missing arguments'))
      } else if (!args.number) {
        reject(new Error('Missing number argument'))
      } else if (!args.uuid) {
        args.uuid = Uuid()
      } else if (typeof args.autoCommit === 'undefined') {
        args.autoCommit = true
      }

      this.consumer.consume(args.number, (err, messages) => {
        this.log.trace({ uuid: args.uuid }, 'assignments', this.consumer.assignments())
        this.log.trace({ uuid: args.uuid }, 'position', this.consumer.position())

        if (messages && messages.length > 0) {
          this.log.trace(
            { uuid: args.uuid },
            `Receive ${messages.length} messages from offset: ${messages[0].offset} partition: ${messages[0].partition}`
          )
        }

        if (err) {
          this.log.warn({ uuid: args.uuid, err: err }, 'Error in listen')
          reject(err)
        } else {
          if (args.autoCommit === true) {
            this.commit({ uuid: args.uuid }).then(() => {
              resolve(messages)
            })
              .catch((err) => {
                reject(err)
              })
          } else {
            resolve(messages)
          }
        }
      })
    })
  }
}

module.exports = container => {
  if (!container || !container.log) {
    console.error('Please provide a logger instance for kafka consumer!')
    process.exit(1)
  } else if (!container || !container.prom) {
    console.error('Please provide a prom instance for kafka consumer!')
    process.exit(1)
  } else {
    if (!instance) {
      instance = new KafkaConsumer(container)
    }
  }

  return instance
}
