const Uuid = require('uuid/v4')

let instance = null

class KafkaConsumerMock {
  constructor (container) {
    this.log = container.log.child
      ? container.log.child({ child: 'KafkaConsumerMock' })
      : container.log
  }

  connect (topics, uuid) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  subscribe (topics) {

  }

  commit (args) {
    return new Promise((resolve, reject) => {
      resolve()
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

      resolve([])
    })
  }
}

module.exports = container => {
  if (!container || !container.log) {
    console.error('Please provide a logger instance for kafka consumer!')
    process.exit(1)
  } else {
    if (!instance) {
      instance = new KafkaConsumerMock(container)
    }
  }

  return instance
}