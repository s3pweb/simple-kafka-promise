const Kafka = require('node-rdkafka')
const config = require('config')
const hirestime = require('hirestime')

let instance = null

class KafkaProducer {
  constructor (container) {
    this.log = container.log.getChild
      ? container.log.child({ child: 'KafkaProducer' })
      : container.log
    this.kafkaGlobalUuid = 'KafkaProducerGlobalUuid'
    this.connected = false

    this.prom = container.prom ? container.prom : {}

    this.log.info('config=', JSON.stringify(config))

    this.producerConfig = {
      ...config.kafka.producer.config,
      ...{
        'retry.backoff.ms': 250,
        'message.send.max.retries': 10,

        'socket.keepalive.enable': true,

        'queue.buffering.max.messages': 100000,
        'queue.buffering.max.ms': 25,

        'statistics.interval.ms': 1000,

        'batch.num.messages': 10000,

        'enable.idempotence': true, // When set to true, the producer will ensure that messages are successfully produced exactly once and in the original produce order.

        'request.required.acks': 1, // wait for leader ack

        debug: 'all',
        dr_cb: true
      }
    }

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
      this.log.info({ uuid: this.kafkaGlobalUuid }, 'Starting Kafka producer')

      if (this.producer && this.connected === true) {
        this.log.info(
          { uuid: this.kafkaGlobalUuid },
          'Kafka already connected'
        )
        resolve()
      } else {
        this.producer = new Kafka.Producer(this.producerConfig, {})
        this.log.debug({ producer: this.producerConfig }, 'Creating producer')

        this.log.debug('Kafka.features', Kafka.features)

        this.producer.on('event.throttle', throttle => {
          this.log.trace('throttle', throttle)
        })

        this.producer.on('event.stats', stats => {
          // this.log.info("stats", JSON.stringify(stats,null,1));

          try {
            this.stats = JSON.parse(stats.message)
          } catch (error) {
            this.log.error('fail to parse stats')
          }
        })

        this.producer.on('event.log', log => {
          var notdisplay = ['TOPPAR', 'APIVERSION']

          if (notdisplay.indexOf(log.fac) === -1) {
            this.log.trace(log)
          }
        })

        this.producer.connect(
          null,
          (err, metadata) => {
            if (err) {
              this.log.error(
                { uuid: this.kafkaGlobalUuid, err },
                'Producer error while connecting'
              )
              reject(err)
            } else {
              this.log.trace(JSON.stringify(metadata, null, 3))

              this.log.info(
                { uuid: this.kafkaGlobalUuid },
                'Kafka producer ready'
              )

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
      this.log.debug(
        { uuid: this.kafkaGlobalUuid },
        'Try to disconnecting producer'
      )
      this.producer.poll()

      this.producer.disconnect()

      this.producer.once('disconnected', arg => {
        this.log.info('producer disconnected. ' + JSON.stringify(arg))

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
    console.log(
      'producer.listeners(delivery-report)',
      this.producer.rawListeners('delivery-report')
    )
    console.log(
      'producer.listeners(event.error)',
      this.producer.rawListeners('event.error')
    )
    console.log()
  }

  sendMessage (topic, message, cpt, partition, key) {
    this.promNbEvents.inc()
    const fullTopic = config.kafka.producer.topicsPrefix + topic

    this.log.trace(
      { uuid: this.kafkaGlobalUuid },
      `Sending message to ${fullTopic}`
    )
    this.producer.produce(
      fullTopic,
      partition,
      Buffer.from(JSON.stringify(message)),
      key,
      Date.now(),
      cpt
    )
  }

  sendMessagesAndWaitReport (topic, messages, partition = 0, key = 'none') {
    return new Promise(async (resolve, reject) => {
      let deliveryReportListener
      let errorListener

      try {
        if (!messages || messages.length === 0) {
          resolve('No events to send to Kafka')
        }

        let getTotalElapsed = hirestime()

        let nbEvents = messages.length

        let cptDelivery = 0

        this.log.debug(`Sending ${nbEvents} messages to Kafka...`)

        deliveryReportListener = (err, report) => {
          if (err) {
            this.log.error(
              { err: err },
              'Error sending message to Kafka'
            )

            this.promNbError.inc()
            reject(err)
          } else {
            this.log.trace(`Delivery Report ${JSON.stringify(report)}`)
          }

          // remove id from the list
          deliveryCheck = deliveryCheck.filter(item => item !== report.opaque)

          this.log.trace(report.opaque + ' -> deliveryCheck', deliveryCheck)

          if (deliveryCheck.length === 0) {
            clearTimeout(timeout)

            this.producer.removeListener(
              'delivery-report',
              deliveryReportListener
            )

            this.producer.removeListener('event.error', errorListener)

            clearInterval(tt)

            let ms = getTotalElapsed(hirestime.MS)

            this.log.info(
              `${nbEvents} events send in ${ms} ms / avg per event = ${ms / nbEvents} ms`
            )

            resolve()
          }
        }

        this.producer.on('delivery-report', deliveryReportListener, false)

        errorListener = error => {
          console.error(error)
          this.log.error(
            { uuid: this.kafkaGlobalUuid, err: error },
            `Error on Kafka producer: ${error.message}`
          )

          this.producer.removeListener(
            'delivery-report',
            deliveryReportListener,
            false
          )
          this.producer.removeListener('event.error', errorListener)

          this.promNbError.inc()

          reject(error)
        }

        this.producer.on('event.error', errorListener)

        var deliveryCheck = []
        for (let index = 0; index < nbEvents; index++) {
          const message = messages[index]

          let id = this.indexMessage++

          this.sendMessage(topic, message, id, partition, key)

          deliveryCheck.push(id)
        }

        var tt = setInterval(() => {
          this.producer.poll()
        }, 10)

        let timeout = setTimeout(() => {
          this.promNbError.inc()

          this.log.error('Kafka timeout !!!')
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
        this.log.error({ err: err }, `Error sending messages to Kafka`)
        this.producer.removeListener('delivery-report', deliveryReportListener)
        this.producer.removeListener('event.error', errorListener)
        reject(err)
      }
    })
  }
}

module.exports = container => {
  if (!container || !container.log) {
    console.log()
    console.log('Please provide a logger instance for kafka producer !!!')
    console.log()
    process.exit(0)
  } else if (!container || !container.prom) {
    console.log()
    console.log('Please provide a prom instance for kafka producer !!!')
    console.log()

    process.exit(0)
  } else {
    if (!instance) {
      instance = new KafkaProducer(container)
    }
  }

  return instance
}
