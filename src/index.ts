export { KafkaProducer } from './lib/kafkaHighLevelProducer';
export { KafkaConsumer } from './lib/kafkaConsumer';

import consumerMock = require('./mock/kafkaNconsumer.mock');
import producerMock = require('./mock/kafkaNproducer.mock');

export { consumerMock, producerMock };
