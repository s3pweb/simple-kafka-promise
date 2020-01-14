'use strict'

const KafkaConsumer = require('../dist/index').KafkaConsumer

function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

const t = async () => {
  const consumer = new KafkaConsumer({ 'metadata.broker.list': '0.0.0.0:9094', 'group.id': 'test.group' }, 1000)

  await consumer.connect(['s3pweb.test223'])

  console.log('wait a little')

  await later(200)

  let previousPartition = 0
  let cpt = 0

  while (cpt < 200) {
    const messages = await consumer.listen(10, true)

    for (const message of messages) {
      cpt++

      const txt = `${message.partition} - ${message.offset} * `

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
