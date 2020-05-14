# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.1](https://github.com/s3pweb/simple-kafka-promise/compare/v2.2.0...v2.2.1) (2020-05-14)


### Bug Fixes

* **consumer:** add partition parameter to get offsets function ([7ed0c77](https://github.com/s3pweb/simple-kafka-promise/commit/7ed0c77101c322b7fa068b4b2959d5e35db60f8b))

## [2.2.0](https://github.com/s3pweb/simple-kafka-promise/compare/v2.1.0...v2.2.0) (2020-05-13)


### Features

* **consumer:** add get offsets to consumer ([15582f7](https://github.com/s3pweb/simple-kafka-promise/commit/15582f7e629e7e95f915fe0102723dbe69dafacf))
* **consumer:** add librdkafka types to consumer's functions ([94ed43d](https://github.com/s3pweb/simple-kafka-promise/commit/94ed43dc634ca5d6645ac2ad428d3c5e7ce67470))

## [2.1.0](https://github.com/s3pweb/simple-kafka-promise/compare/v2.0.0...v2.1.0) (2020-04-29)


### Features

* **dependencies:** removed unused @types/config package ([0db5ca3](https://github.com/s3pweb/simple-kafka-promise/commit/0db5ca33a9499746a47573d50038250a3ac7515d))
* **dependencies:** update node-rdkafka to 2.8.1 ([e42a454](https://github.com/s3pweb/simple-kafka-promise/commit/e42a4543e80f6f599587fac248a7e628e8f80676))
* **release:** add standard-version for autonomous releases ([31814cd](https://github.com/s3pweb/simple-kafka-promise/commit/31814cdcbee219f9c84b0b1c6236dd762b5c7ca4))
* **workflows:** added github workflow to publish to npm ([6701055](https://github.com/s3pweb/simple-kafka-promise/commit/67010558228e9c09869d12e9e580c8c2b79b9104))

## [2.0.0] - 2020-01-14
### Added
- (consumer) added consumer interface
### Changed
- (index) changed export style to typescript 
- (producer) migration of high level producer to typescript
- (consumer) migration of kafka consumer to typescript
- (mock) migration of mocked consumer to typescript
- (mock) migration of mocked producer to typescript
- (examples) updated examples for producer and consumer
### Fixed
- (producer) fixed thrown error if kafka.producer.topicsPrefix was missing
### Removed
- (producer) removed kafkaNProducer
- (producer) removed poll() before disconnecting
- (dependencies) removed unused hirestime and uuid dependency
- (dependencies) removed unused prom-client, s3pweb-logger and config dependency

## [1.1.1] - 2020-01-07
### Removed
- (producer) removed useless poll() before disconnecting in kafkaHighLevelProducer

## [1.1.0] - 2019-12-09
### Changed
- (standard) ran standard --fix and removed unused prometheus instances
- (npm) improved git ignore and removed npm ignore
- (npm) changed package name to @s3pweb/simple-kafka-promise
- (sources) moved sources files to src folder
- (npm) published files are now whitelisted in package.json

## [1.0.2] - 2019-11-18
### Changed
- (dependencies) updated node-rdkafka to 2.7.4
### Security
- (dependencies) updated config, hirestime, uuid, prom-client and logger

## [1.0.1] - 2019-06-12
### Fixed
- (mock) KafkaProducerMock -> producer.getMetadata

## [1.0.0] - 2019-06-12
### Added
- (mock) consumer + producer

## [0.3.2] - 2019-06-06
### Fixed
- (logger) changed getChild to child
### Security
- (dependencies) updated config, node-rdkafka, prom-client and logger

## [0.3.1] - 2019-04-24
### Fixed
- (HLProducer) added missing export

## [0.3.0] - 2019-04-24
### Added
- (producer) added High Level Producer
### Security
- (dependencies) updated node-rdkafka and logger

[Unreleased]: https://github.com/s3pweb/simple-kafka-promise/commits
[2.0.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v2.0.0
[1.1.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.1.1
[1.1.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.1.0
[1.0.2]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.2
[1.0.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.1
[1.0.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.0
[0.3.2]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.2
[0.3.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.1
[0.3.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.0
