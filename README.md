[![npm (scoped)](https://img.shields.io/npm/v/@s3pweb/simple-kafka-promise)](https://www.npmjs.com/package/@s3pweb/simple-kafka-promise)

# Simple kafka promise

This library is based on [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and aim to provide a simple producer 
and consumer wrapped with promise to allow the use of `async / await` with minimal configuration and overhead.

This library is fully written in TypeScript.

Use s3pweb/alpine-kafka docker image with node-rdkafka included to shorten build time
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/s3pweb/alpine-kafka?sort=semver)](https://hub.docker.com/repository/docker/s3pweb/alpine-kafka)
(version tag is the version of node-rdkafka).

## Latest release 

## [3.2.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.1.0...v3.2.0) (2021-01-06)

### Features

* **deps:** update node-rdkafka to 2.10.0 ([297789a](https://github.com/s3pweb/simple-kafka-promise/commit/297789a91005e8ddf54f9ac5c387556b01f3a8a1))

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
