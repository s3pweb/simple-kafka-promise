# Installation

```bash
npm install simple-kafka-promise
```

# Config

Configurations are stored in configuration files within your application, and can be overridden and extended by environment variables, command line parameters, or external sources. See : http://lorenwest.github.io/node-config/

1. Create a config folder

2. Create a file(s) with the name of your environnement(s) like test.json

3. Paste this configuration template :

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
      "topicsPrefix": "s3pweb."
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

# Example :

To produce some messages

```js
const clientPrometheus = require("prom-client");

// const faker = require('faker')

function later(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

var t = async () => {
  var log = require("s3pweb-logger").logger;

  try {
    var producer = require("..").producer({ log: log, prom: clientPrometheus });

    await producer.connect();

    console.log("connected");

    console.log("wait a little");

    await later(200);

    // var topicName = faker.random.alphaNumeric(10)
    var topicName = "test223";

    for (let index = 0; index < 10; index++) {
      try {
        var p1 = producer.sendMessagesAndWaitReport({
          topic: topicName,
          messages: [
            { message: 1.1 },
            { message: 1.2 },
            { message: 1.3 },
            { message: 1.4 },
            { message: 1.1 },
            { message: 1.2 },
            { message: 1.3 },
            { message: 1.4 }
          ],
          partition: 0,
          key: "key1"
        });

        var p2 = producer.sendMessagesAndWaitReport({
          topic: topicName,
          messages: [
            { message: 2.1 },
            { message: 2.2 },
            { message: 2.3 },
            { message: 2.4 },
            { message: 2.1 },
            { message: 2.2 },
            { message: 2.3 },
            { message: 2.4 },
            { message: 2.1 },
            { message: 2.2 },
            { message: 2.3 },
            { message: 2.4 }
          ]
        });

        await Promise.all([p1, p2]);
      } catch (error) {
        console.log(`Loop ${index} -> error`, error);

        await later(5000);
      }

      await later(750);
    }

    await producer.disconnect();
  } catch (error) {
    console.log(error);
  }
};

t();
```

To consume some messages

```js
const clientPrometheus = require("prom-client");

function later(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

var t = async () => {
  var log = require("s3pweb-logger").logger;

  var consumer = require("..").consumer({ log: log, prom: clientPrometheus });

  await consumer.connect(["s3pweb.test223"]);

  console.log("wait a little");

  await later(200);

  var previousPartition = 0;
  var cpt = 0;

  while (cpt < 200) {
    var messages = await consumer.listen({number:10, autoCommit: true);

    for (let message of messages) {
      cpt++;

      var txt = `${message.partition} - ${message.offset} * `;

      if (previousPartition !== message.partition) {
        previousPartition = message.partition;
        console.log(txt);
      } else {
        process.stdout.write(txt);
      }
    }

    console.log(cpt);

    console.log("----------------------------");
  }

  console.log("RECEIVE ALL EVENTS");

  await later(200);

  await consumer.disconnect();
};

t();
```

# Bonus

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
