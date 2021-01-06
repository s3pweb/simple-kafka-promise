# Simple kafka promise

This library is based on [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and aim to provide a simple producer 
and consumer wrapped with promise to allow the use of `async / await` with minimal configuration and overhead.

This library is fully written in TypeScript.

## Latest release 

## [3.1.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.0.0...v3.1.0) (2021-01-06)

### Features

* **consumer:** add commitOffset and commitMessage functions ([20127a8](https://github.com/s3pweb/simple-kafka-promise/commit/20127a86aed22898d9905ccfed394fd92df11d66))

### Other

* **deps-dev:** update @types/node to 12.19.12 ([87f1c02](https://github.com/s3pweb/simple-kafka-promise/commit/87f1c023a72cd09665dfed1ca335cacb53a58cf0))
* **deps-dev:** update standard-version to 9.1.0 ([254a14c](https://github.com/s3pweb/simple-kafka-promise/commit/254a14cd7de2aae6e4f595df846a1c777b83d214))
* **deps-dev:** update typescript to 4.1.3 ([8ae1650](https://github.com/s3pweb/simple-kafka-promise/commit/8ae1650363b01c0e06ae320455fce95766b812ab))

## Breaking changes from 2.x.x
- 2 different producers are available

## Breaking changes from 1.x.x
- Producer and consumer now are classes and have a constructor
- No more direct need for node-config and a logger

## Installation

```bash
npm install @s3pweb/simple-kafka-promise
```

## Configuration

Minimal configuration for the **consumer** is:
```json
{ "metadata.broker.list": "0.0.0.0:9094", "group.id": "test.group" }
```

Minimal configuration for the **producer** is:
```json
{ "metadata.broker.list": "0.0.0.0:9094" }
```

This project is based on node-rdkafka and supports the same configuration options.
Go [here](https://github.com/Blizzard/node-rdkafka#configuration) for more details.

## Create a consumer instance

```js
const KafkaConsumer = require('@s3pweb/simple-kafka-promise').KafkaConsumer

// Create a new instance
const consumer = new KafkaConsumer({ 'metadata.broker.list': '0.0.0.0:9094', 'group.id': 'test.group' }, 1000)

// Connect
await consumer.connect(['topicName'])

// Consume messages
const messagesArray = await consumer.listen(100, true)

// Disconnect the consumer
await consumer.disconnect()
```

To use with typescript, just change the import to
```typescript
import { KafkaConsumer } from '@s3pweb/simple-kafka-promise';
```

## Create a producer instance

```js
const KafkaProducer = require('@s3pweb/simple-kafka-promise').KafkaProducer

// Create a new instance
const producer = new KafkaProducer({ 'metadata.broker.list': '0.0.0.0:9094' }, '')

// Connect
await producer.connect(['topicName'])

// Produce some messages
const offset = await producer.sendMessage(topicName, { message: `My message.` }, 0, null)

// Disconnect
await producer.disconnect()
```

To use with typescript, just change the import to
```typescript
import { KafkaProducer } from '@s3pweb/simple-kafka-promise';
```

## Example

To produce some messages take a look at `./examples/producer.js` and to consume some messages take a look at `./examples/consumer.js`.

If you have docker, you can use `./examples/docker-compose.yaml` to start one `zookeeper` and one `kafka` stack on your machine. 
This stack comes with `kafkamanager`  and `kafkadrop` for easy monitoring and debugging.
## Docker

If you want to build a docker image based on alpine linux, you need to add some packages to the base image. 
Go [here](https://github.com/Blizzard/node-rdkafka/blob/master/examples/docker-alpine.md) for more details.
