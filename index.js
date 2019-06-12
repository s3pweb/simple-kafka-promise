module.exports.producer = require('./lib/kafkaNproducer')
module.exports.highLevelProducer = require('./lib/highLevel/kafkaHighLevelProducer')
module.exports.consumer = require('./lib/kafkaNconsumer')


module.exports.consumer = require('./mock/kafkaNconsumer.mock')
module.exports.producer = require('./mock/kafkaNproducer.mock')