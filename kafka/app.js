const { Kafka } = require('kafkajs')
const randomAnimalName = require('random-animal-name')

const kafka = new Kafka({
  clientId: 'nt-app',
  brokers: ['kafka:9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  const animalName = randomAnimalName()

  // Producing
  await producer.connect()

  setInterval(async () => {
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: animalName },
      ],
    })
  }, 5000);

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)
