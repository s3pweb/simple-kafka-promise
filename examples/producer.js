const clientPrometheus = require('prom-client')

// const faker = require('faker')

function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

var t = async () => {
  var log = require('s3pweb-logger').logger

  try {
    var producer = require('..').producer({ log: log, prom: clientPrometheus })

    await producer.connect()

    console.log('connected')

    console.log('wait a little')

    await later(200)

    // var topicName = faker.random.alphaNumeric(10)
    var topicName = 'test223'

    for (let index = 0; index < 10; index++) {
      try {
        var p1 = producer.sendMessagesAndWaitReport(
          { topic: topicName,
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
            key: 'key1' }
        )

        var p2 = producer.sendMessagesAndWaitReport(
          { topic: topicName,
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
            ],
            key: 'key2'
          }
        )

        await Promise.all([p1, p2])
      } catch (error) {
        console.log(`Loop ${index} -> error`, error)

        await later(5000)
      }

      await later(750)
    }

    await producer.disconnect()
  } catch (error) {
    console.log(error)
  }
}

t()
