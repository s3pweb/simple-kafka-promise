const config = require('config')

const Uuid = require('uuid/v4')

let instance = null

class KafkaProducerMock {
  constructor (container) {
    this.log = container.log.child
      ? container.log.child({ child: 'KafkaProducerMock' })
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

        'batch.num.messages': 10000,

        'request.required.acks': 1, // wait for leader ack

        debug: 'all',
        dr_cb: true
      }
    }

    this.indexMessage = 0


  }

  connect (uuid = require('uuid/v1')()) {
    this.kafkaGlobalUuid = uuid

    return new Promise((resolve, reject) => {
      if (this.connected === true) {
        resolve()
      } else {
        this.connected = true
        resolve()
      }
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  displayProducerInfo () {
    console.log('displayProducerInfo MOCK')
  }

  sendMessage (topic, message, cpt, partition, key) {
  }

  sendMessagesAndWaitReport (args) {
    return new Promise(async (resolve, reject) => {

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

      let nbEvents = args.messages.length
      this.indexMessage = this.indexMessage + nbEvents

      resolve()

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
      instance = new KafkaProducerMock(container)
    }
  }

  return instance
}
