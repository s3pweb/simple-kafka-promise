# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.2.0](https://github.com/s3pweb/simple-kafka-promise/compare/v4.1.0...v4.2.0) (2021-09-07)


### Features

* **deps:** update to node-rdkafka@2.11.0 ([6d74586](https://github.com/s3pweb/simple-kafka-promise/commit/6d74586c424ae10be67a3796657a99e0b3ad2649))


### Other

* **deps-dev:** add eslint and prettier to replace tslint ([25d0f20](https://github.com/s3pweb/simple-kafka-promise/commit/25d0f20780de6b860191a96e3802c59d0b2d9228))
* **deps-dev:** remove tslint ([926c425](https://github.com/s3pweb/simple-kafka-promise/commit/926c425b4374c4ceca7194aa7ad77a7624b741b6))
* **deps-dev:** update to @commitlint/cli@13.1.0 and @commitlint/config-conventional@13.1.0 ([db42bcf](https://github.com/s3pweb/simple-kafka-promise/commit/db42bcf1834cc8b260c3efda552d6d7c1f4a6d01))
* **deps-dev:** update to @types/node@16.7.13 and node 16.8.0 ([adf9cff](https://github.com/s3pweb/simple-kafka-promise/commit/adf9cff069771a6e159d9862c352810fece8267b))
* **deps-dev:** update to husky@7.0.0 ([4b21dbe](https://github.com/s3pweb/simple-kafka-promise/commit/4b21dbe16b7ff0ad45808485832d72b55334aa7b))
* **deps-dev:** update to standard-version@9.3.1 ([0ed60a4](https://github.com/s3pweb/simple-kafka-promise/commit/0ed60a43b1b7a5fa945a3bfa7959646cd295f472))
* **deps-dev:** update to typescript@4.4.2 ([dee4ac7](https://github.com/s3pweb/simple-kafka-promise/commit/dee4ac78a9b6a194bbcbff18912a1df765b846a0))

## [4.1.0](https://github.com/s3pweb/simple-kafka-promise/compare/v4.0.0...v4.1.0) (2021-08-03)


### Features

* **producer:** add getMetadata function to producers ([1f32c29](https://github.com/s3pweb/simple-kafka-promise/commit/1f32c2990da889c9da8f0ee8cfcb7db8503345a0))

## [4.0.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.3.0...v4.0.0) (2021-04-23)


### ⚠ BREAKING CHANGES

* **producer:** By default node-rdkafka will set request.required.acks at -1. You can override it by setting "request.required.acks" or "acks" in the config object.

### Features

* **producer:** removes request.required.acks from producer's configuration ([438b767](https://github.com/s3pweb/simple-kafka-promise/commit/438b7678c020af96ab6400d2e8488d79ad87295f))

## [3.3.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.2.0...v3.3.0) (2021-01-15)


### Features

* **deps:** update node-rdkafka to 2.10.1 ([861ff6c](https://github.com/s3pweb/simple-kafka-promise/commit/861ff6c35f3f652eb5b7d3aef11825003ebe8dad))

## [3.2.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.1.0...v3.2.0) (2021-01-06)


### Features

* **deps:** update node-rdkafka to 2.10.0 ([297789a](https://github.com/s3pweb/simple-kafka-promise/commit/297789a91005e8ddf54f9ac5c387556b01f3a8a1))

## [3.1.0](https://github.com/s3pweb/simple-kafka-promise/compare/v3.0.0...v3.1.0) (2021-01-06)


### Features

* **consumer:** add commitOffset and commitMessage functions ([20127a8](https://github.com/s3pweb/simple-kafka-promise/commit/20127a86aed22898d9905ccfed394fd92df11d66))


### Other

* **deps-dev:** update @types/node to 12.19.12 ([87f1c02](https://github.com/s3pweb/simple-kafka-promise/commit/87f1c023a72cd09665dfed1ca335cacb53a58cf0))
* **deps-dev:** update standard-version to 9.1.0 ([254a14c](https://github.com/s3pweb/simple-kafka-promise/commit/254a14cd7de2aae6e4f595df846a1c777b83d214))
* **deps-dev:** update typescript to 4.1.3 ([8ae1650](https://github.com/s3pweb/simple-kafka-promise/commit/8ae1650363b01c0e06ae320455fce95766b812ab))

## [3.0.0](https://github.com/s3pweb/simple-kafka-promise/compare/v2.3.0...v3.0.0) (2021-01-06)


### Features

* **producer:** add "send messages and await report" producer ([7f041c3](https://github.com/s3pweb/simple-kafka-promise/commit/7f041c3f752b5785cf75bee14352407e2efc11fa))


### Bug Fixes

* **rdkafka:** revert node-rdkafka to 2.7.4 ([83f0390](https://github.com/s3pweb/simple-kafka-promise/commit/83f039030ecb7300d8cbd63f148943d6c4287424))
* **rdkafka:** bump node-rdkafka back to 2.9.0 ([7b04ec4](https://github.com/s3pweb/simple-kafka-promise/commit/7b04ec432c311b03f39e1c39ec31247e45fe4112))

## [2.3.0](https://github.com/s3pweb/simple-kafka-promise/compare/v2.2.1...v2.3.0) (2020-07-17)


### Features

* **deps:** update node-rdkafka to 2.9.0 ([46c2c4a](https://github.com/s3pweb/simple-kafka-promise/commit/46c2c4a27e1f1b9e4b62a043a0452eda242d8efa))


### Other

* **deps-dev:** update @types/node to 14.0.23 ([3024921](https://github.com/s3pweb/simple-kafka-promise/commit/3024921abda6c0df47f76de2c7c0b237e4d1ee8c))
* **deps-dev:** update standard-version to 8.0.2 ([593d421](https://github.com/s3pweb/simple-kafka-promise/commit/593d42121458f5839cca65d9683f5f44dc9a66eb))
* **deps-dev:** update typescript to 3.9.7 ([8803f57](https://github.com/s3pweb/simple-kafka-promise/commit/8803f578039bcee1610865fcacec7499e4ac562b))

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
