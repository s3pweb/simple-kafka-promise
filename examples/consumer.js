function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

const t = async () => {
  const log = require('@s3pweb/s3pweb-logger').logger

  const consumer = require('..').consumer({ log: log })

  await consumer.connect(['s3pweb.test223'])

  console.log('wait a little')

  await later(200)

  let previousPartition = 0
  let cpt = 0

  while (cpt < 200) {
    const messages = await consumer.listen({ number: 10, autoCommit: true })

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
