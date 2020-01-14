# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- (consumer) added consumer interface
### Changed
- (index) changed export style to typescript 
- (producer) migration of high level producer to typescript
- (consumer) migration of kafka consumer to typescript
- (mock) migration of mocked consumer to typescript
- (mock) migration of mocked producer to typescript
- (examples) updated examples for producer and consumer
### Deprecated
### Fixed
- (producer) fixed thrown error if kafka.producer.topicsPrefix was missing
### Removed
- (producer) removed kafkaNProducer
- (producer) removed poll() before disconnecting
- (dependencies) removed node-config dependency
- (dependencies) removed unused hirestime and uuid dependency
### Security

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
[1.1.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.1.1
[1.1.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.1.0
[1.0.2]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.2
[1.0.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.1
[1.0.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v1.0.0
[0.3.2]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.2
[0.3.1]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.1
[0.3.0]: https://github.com/s3pweb/simple-kafka-promise/commits/v0.3.0
