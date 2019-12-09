const Uuid = require('uuid/v4')

let instance = null

class KafkaProducerMock {
  constructor (container) {
    this.log = container.log.child
      ? container.log.child({ child: 'KafkaProducerMock' })
      : container.log
    this.connected = false
    this.indexMessage = 0
  }

  connect (uuid) {
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
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  sendMessagesAndWaitReport (args) {
    return new Promise((resolve, reject) => {
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

      const nbEvents = args.messages.length
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
