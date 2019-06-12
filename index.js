module.exports.producer = require('./lib/kafkaNproducer')
module.exports.highLevelProducer = require('./lib/highLevel/kafkaHighLevelProducer')
module.exports.consumer = require('./lib/kafkaNconsumer')

module.exports.consumerMock = require('./mock/kafkaNconsumer.mock')
module.exports.producerMock = require('./mock/kafkaNproducer.mock')
