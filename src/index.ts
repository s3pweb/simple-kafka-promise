export { KafkaProducer } from './lib/kafkaHighLevelProducer';

import consumer = require('./lib/kafkaNconsumer');
import consumerMock = require('./mock/kafkaNconsumer.mock');
import producerMock = require('./mock/kafkaNproducer.mock');

export { consumer, consumerMock, producerMock };
