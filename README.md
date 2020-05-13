# Simple kafka promise

This library is based on [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and aim to provide a simple producer 
and consumer wrapped with promise to allow the use of `async / await` with minimal configuration and overhead.

This library is fully written in TypeScript.

## Latest release [2.2.0](https://github.com/s3pweb/simple-kafka-promise/compare/v2.1.0...v2.2.0) (2020-05-13)

### Features

* **consumer:** add get offsets to consumer ([15582f7](https://github.com/s3pweb/simple-kafka-promise/commit/15582f7e629e7e95f915fe0102723dbe69dafacf))
* **consumer:** add librdkafka types to consumer's functions ([94ed43d](https://github.com/s3pweb/simple-kafka-promise/commit/94ed43dc634ca5d6645ac2ad428d3c5e7ce67470))

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
