const Kafka = require('node-rdkafka')
const config = require('config')
const hirestime = require('hirestime')

const Uuid = require('uuid/v4')

let instance = null

class KafkaProducer {
  constructor (container) {
    this.log = container.log.getChild
      ? container.log.child({ child: 'KafkaProducer' })
      : container.log
    this.kafkaGlobalUuid = 'KafkaProducerGlobalUuid'
    this.connected = false

    this.prom = container.prom ? container.prom : {}

    this.producerConfig = {
      ...(container.config ? container.config : config.kafka.producer.config),
      ...{
        // DON'T WORK - 21/10/2018
        // When set to true, the producer will ensure that messages are successfully produced exactly once and in the original produce order.
        // 'enable.idempotence': true,

        'retry.backoff.ms': 250,
        'message.send.max.retries': 10,

        'socket.keepalive.enable': true,

        'queue.buffering.max.messages': 100000,
        'queue.buffering.max.ms': 25,

        'statistics.interval.ms': 1000,

        'batch.num.messages': 10000,

        'request.required.acks': 1, // wait for leader ack

        debug: 'all',
        dr_cb: true
      }
    }

    this.log.trace({ config: this.producerConfig }, 'Creating kafka producer')

    this.indexMessage = 0

    this.promNbEvents = new this.prom.Counter({
      name: 'kafka_client_events_sent',
      help: 'Total events sent to kafka'
    })

    this.promNbError = new this.prom.Counter({
      name: 'kafka_client_nb_errors',
      help: 'Total errors '
    })
  }

  connect (uuid = require('uuid/v1')()) {
    this.kafkaGlobalUuid = uuid

    return new Promise((resolve, reject) => {
      this.log.trace({ uuid: this.kafkaGlobalUuid }, 'Starting Kafka producer')

      if (this.producer && this.connected === true) {
        this.log.trace(
          { uuid: this.kafkaGlobalUuid },
          'Kafka already connected'
        )
        resolve()
      } else {
        this.producer = new Kafka.Producer(this.producerConfig, {})
        this.log.trace({ producer: this.producerConfig }, 'Creating producer')

        this.log.trace('Kafka.features', Kafka.features)

        this.producer.on('event.throttle', throttle => {
          this.log.trace('throttle', throttle)
        })

        this.producer.on('event.stats', stats => {
          // this.log.trace("stats", JSON.stringify(stats,null,1));

          try {
            this.stats = JSON.parse(stats.message)
          } catch (error) {
            this.log.error('fail to parse stats')
          }
        })

        this.producer.on('event.log', log => {
          let notdisplay = ['TOPPAR', 'APIVERSION']

          if (notdisplay.indexOf(log.fac) === -1) {
            this.log.trace(log)
          }
        })

        this.producer.connect(
          null,
          (err, metadata) => {
            if (err) {
              this.log.error({ uuid: this.kafkaGlobalUuid, err }, 'Producer error while connecting')
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

      this.producer.poll()

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

  displayProducerInfo () {
    console.log()
    console.log('producer.eventNames()=', this.producer.eventNames())
    console.log('producer.listeners(delivery-report)', this.producer.rawListeners('delivery-report'))
    console.log('producer.listeners(event.error)', this.producer.rawListeners('event.error'))
    console.log()
  }

  sendMessage (topic, message, cpt, partition, key) {
    this.promNbEvents.inc()
    const fullTopic = (config.kafka.producer.topicsPrefix ? config.kafka.producer.topicsPrefix : '') + topic

    this.log.trace({ uuid: this.kafkaGlobalUuid }, `Sending message to ${fullTopic}`)

    this.producer.produce(
      fullTopic,
      partition,
      Buffer.from(JSON.stringify(message)),
      key,
      Date.now(),
      cpt
    )
  }

  sendMessagesAndWaitReport (args) {
    return new Promise(async (resolve, reject) => {
      let deliveryReportListener
      let errorListener

      if (!args) {
        reject(new Error('Missing arguments'))
      } else if (!args.topic) {
        reject(new Error('Missing topic'))
      } else if (!args.messages || args.messages.length === 0) {
        reject(new Error('Missing messages'))
      } else if (!args.partition) {
        args.partition = 0
      } else if (!args.key) {
        args.key = 'none'
      } else if (!args.uuid) {
        args.uuid = Uuid()
      }

      try {
        let getTotalElapsed = hirestime()

        let nbEvents = args.messages.length

        let cptDelivery = 0

        this.log.trace(`Sending ${nbEvents} messages to Kafka...`)

        deliveryReportListener = (err, report) => {
          if (err) {
            this.log.error({ uuid: args.uuid, err: err }, 'Error sending message to Kafka')

            this.promNbError.inc()
            reject(err)
          } else {
            // this.log.trace({ uuid: args.uuid }, `Delivery Report ${JSON.stringify(report)}`)
          }

          // remove id from the list
          deliveryCheck = deliveryCheck.filter(item => item !== report.opaque)

          // this.log.trace({ uuid: args.uuid }, report.opaque + ' -> deliveryCheck', deliveryCheck)

          if (deliveryCheck.length === 0) {
            clearTimeout(timeout)

            this.producer.removeListener('delivery-report', deliveryReportListener)
            this.producer.removeListener('event.error', errorListener)

            clearInterval(tt)

            let ms = getTotalElapsed(hirestime.MS)
            this.log.trace({ uuid: args.uuid }, `${nbEvents} events send in ${ms} ms / avg per event = ${ms / nbEvents} ms`)

            resolve()
          }
        }

        this.producer.on('delivery-report', deliveryReportListener, false)

        errorListener = error => {
          console.error(error)
          this.log.error({
            uuid: args.uuid ? args.uuid : this.kafkaGlobalUuid,
            err: error
          }, `Error on Kafka producer: ${error.message}`)

          this.producer.removeListener('delivery-report', deliveryReportListener, false)
          this.producer.removeListener('event.error', errorListener)

          this.promNbError.inc()

          reject(error)
        }

        this.producer.on('event.error', errorListener)

        let deliveryCheck = []
        for (let index = 0; index < nbEvents; index++) {
          const message = args.messages[index]

          let id = this.indexMessage++

          this.sendMessage(args.topic, message, id, args.partition, args.key)

          deliveryCheck.push(id)
        }

        let tt = setInterval(() => {
          this.producer.poll()
        }, 10)

        let timeout = setTimeout(() => {
          this.promNbError.inc()

          this.log.error({ uuid: args.uuid }, 'Kafka timeout !!!')
          this.producer.removeListener(
            'delivery-report',
            deliveryReportListener
          )

          this.producer.removeListener('event.error', errorListener)

          clearInterval(tt)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ send: cptDelivery, total: nbEvents })
        }, nbEvents * 60 + 15000)
      } catch (err) {
        this.promNbError.inc()
        this.log.error({ uuid: args.uuid, err: err }, `Error sending messages to Kafka`)
        this.producer.removeListener('delivery-report', deliveryReportListener)
        this.producer.removeListener('event.error', errorListener)
        reject(err)
      }
    })
  }
}

module.exports = container => {
  if (!container || !container.log) {
    console.error('Please provide a logger instance for kafka producer !')
    process.exit(1)
  } else if (!container || !container.prom) {
    console.error('Please provide a prom instance for kafka producer !')
    process.exit(1)
  } else {
    if (!instance) {
      instance = new KafkaProducer(container)
    }
  }

  return instance
}
