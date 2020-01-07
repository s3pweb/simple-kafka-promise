# Simple kafka promise

## Latest release 1.1.1
### Removed
- (producer) removed useless poll() before disconnecting in kafkaHighLevelProducer

## Installation

```bash
npm install @s3pweb/simple-kafka-promise
```

## Config

Configurations are stored in configuration files within your application, and can be overridden and extended by 
environment variables, command line parameters, or external sources. See : http://lorenwest.github.io/node-config/

1. Create a config folder

2. Create a file(s) with the name of your environments(s) like `test.json`

3. Paste this configuration template:

```json
{
  "name": "your-application-name",

  "kafka": {
    "consumer": {
      "config": {
        "metadata.broker.list": "localhost:9094",
        "group.id": "test.group"
      }
    },
    "producer": {
      "config": {
        "metadata.broker.list": "localhost:9094"
      },
      "topicsPrefix": "prefix."
    }
  },

  "logger": {
    "source": false,
    "console": {
      "enable": true,
      "level": "debug"
    },
    "file": {
      "enable": true,
      "level": "info",
      "dir": "./logs"
    },
    "server": {
      "enable": true,
      "level": "trace",
      "url": "0.0.0.0",
      "port": "9998",
      "type": "elk"
    },
    "ringBuffer": {
      "enable": true,
      "size": 50
    }
  }
}
```

## Create instance

```js
const producer = require("@s3pweb/simple-kafka-promise").producer({ log: log, prom: promClient });
const consumer = require("@s3pweb/simple-kafka-promise").consumer({ log: log });
```

Or you could overwrite the config section by passing it as params :

```js
const producer = require("@s3pweb/simple-kafka-promise").producer({ log: log, prom: promClient, config: { "metadata.broker.list": "localhost:9094" } });
const consumer = require("@s3pweb/simple-kafka-promise").consumer({ log: log, config: { "metadata.broker.list": "localhost:9094","group.id": "test.group"} });
```

## Example

To produce some messages take a look at `./examples/producer.js` and to consume some messages take a look at `./examples/consumer.js`.

## Bonus

1. Install ELK stack for logging on docker

```bash

chmod +x example/startElk.sh

./example/startElk.sh

```

Open your favorite browser : http://localhost:5601

Create an index with just _ (replace logstash-_ by \*)

2. Create a kafka broker on docker

```bash
docker-compose -f examples/docker-compose.yaml up -d
```
