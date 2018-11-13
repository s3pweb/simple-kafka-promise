const clientPrometheus = require('prom-client')

function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

var t = async () => {
  var log = require('s3pweb-logger').logger

  var consumer = require('..').consumer({ log: log, prom: clientPrometheus })

  await consumer.connect(['s3pweb.test223'])

  console.log('wait a little')

  await later(200)

  var previousPartition = 0
  var cpt = 0

  while (cpt < 200) {
    var messages = await consumer.listen(10)

    for (let message of messages) {
      cpt++

      var txt = `${message.partition} - ${message.offset} * `

      if (previousPartition !== message.partition) {
        previousPartition = message.partition
        console.log(txt)
      } else {
        process.stdout.write(txt)
      }
    }

    console.log(cpt)

    console.log('----------------------------')
  }

  console.log('RECEIVE ALL EVENTS')

  await later(200)

  await consumer.disconnect()
}

t()
