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
      ...config.kafka.consumer.config,
      ...{
        'enable.auto.commit': false,
        'socket.keepalive.enable': true
      }
    }

    this.log.info({ config: consumerConfig }, 'Creating kafka consumer')

    this.consumer = new Kafka.KafkaConsumer(consumerConfig, {
      'auto.offset.reset': 'earliest'
    })
  }

  connect (topics, uuid = Uuid()) {
    // Kafka global uuid is the same as the server for ease of search
    this.kafkaGlobalUuid = uuid

    // Bus is ready and message(s) can be consumed
    this.consumer.on('ready', () => {
      this.log.info({ uuid: this.kafkaGlobalUuid }, 'Kafka consumer ready')
      this.consumer.setDefaultConsumeTimeout(5000)
      this.consumer.subscribe(topics)
    })

    this.consumer.on('event.stats', stats => {
      this.log.trace(
        { uuid: this.kafkaGlobalUuid },
        'Stats on Kafka listener: ',
        stats
      )
    })

    this.consumer.on('event.throttle', throttle => {
      this.log.warn(
        { uuid: this.kafkaGlobalUuid },
        'Throttle on Kafka listener: ',
        throttle
      )
    })

    // Errors received from the bus
    this.consumer.on('event.error', error => {
      this.log.error(
        { uuid: this.kafkaGlobalUuid, err: error },
        `Error on Kafka listener: ${error.message}`
      )
    })

    return new Promise((resolve, reject) => {
      this.log.info({ uuid: this.kafkaGlobalUuid }, 'Starting Kafka consumer')

      this.consumer.connect(
        null,
        (err, metadata) => {
          if (err) {
            this.log.error(
              { uuid: this.kafkaGlobalUuid, err },
              'Consumer error'
            )
            return reject(err)
          } else {
            this.log.trace('metadata', metadata)
            this.log.info({ uuid: this.kafkaGlobalUuid }, 'Consumer connected')
            return resolve()
          }
        }
      )
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      this.log.info({ uuid: this.kafkaGlobalUuid }, 'Disconnecting listener')
      this.consumer.disconnect((params, metrics) => {
        this.log.info(
          { uuid: this.kafkaGlobalUuid, params, metrics },
          'Disconnected from listener'
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
          this.log.error({ err: err, uuid: args.uuid ? args.uuid : this.kafkaGlobalUuid }, ' Fail to commit offsets')
          reject(err)
        } else {
          this.log.debug(
            { uuid: args.uuid ? args.uuid : this.kafkaGlobalUuid, err },
            'Committed offset: ',
            topicPartitions
          )
          resolve()
        }
      })
    })
  }

  listen (args) {
    return new Promise((resolve, reject) => {
      if (!args) {
        reject('missing args')
      } else if (!args.number) {
        reject('missing number arg')
      } else if (!args.uuid) {
        args.uuid = Uuid()
      } else if (typeof args.autoCommit === 'undefined') {
        args.autoCommit = true
      }

      this.consumer.consume(args.number, (err, messages) => {
        this.log.debug({ uuid: args.uuid }, 'assignments', this.consumer.assignments())
        this.log.debug({ uuid: args.uuid }, 'position', this.consumer.position())

        if (messages && messages.length > 0) {
          this.log.info(
            { uuid: args.uuid },
            `Receive ${messages.length} messages from offset: ${
              messages[0].offset
            } partition: ${messages[0].partition}`
          )
        }

        if (err) {
          this.log.error({ uuid: args.uuid, err: err }, 'Error in listen')
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
    console.log('-----------------------------------------------------------')
    console.log('!!! Please provide a logger instance for kafka consumer !!!')
    console.log('--> consumer({log: log, prom: prom})')
    console.log('-----------------------------------------------------------')
  } else if (!container || !container.prom) {
    console.log('---------------------------------------------------------')
    console.log('!!! Please provide a prom instance for kafka consumer !!!')
    console.log('--> consumer({log: log, prom: prom})')
    console.log('---------------------------------------------------------')
  } else {
    if (!instance) {
      instance = new KafkaConsumer(container)
    }
  }

  return instance
}
