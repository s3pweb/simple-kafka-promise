'use strict'

const KafkaProducer = require('../dist/index').KafkaProducer

function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

const t = async () => {
  try {
    const producer = new KafkaProducer({ 'metadata.broker.list': '0.0.0.0:9094' }, '')

    await producer.connect()

    console.log('connected')

    console.log('wait a little')
    await later(200)

    const topicName = 'test223'

    for (let index = 0; index < 10; index++) {
      try {
        const p1 = await producer.sendMessage(topicName, { message: `p1:${index}` }, 0, null)
        const p2 = await producer.sendMessage(topicName, { message: `p2:${index}` }, 0, null)

        console.log(`Loop ${index}: p1 offset = ${p1}, p2 offset = ${p2}`)
      } catch (error) {
        console.error(`Loop ${index} -> error`, error)
        await later(5000)
      }

      await later(750)
    }

    await producer.disconnect()
  } catch (error) {
    console.log(error)
  }
}

t().catch((err) => {
  console.error(err)
})
