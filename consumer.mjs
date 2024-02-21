import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));


async function main() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel()

    await channel.assertQueue('minha_fila', {
        durable: true,
    })

    channel.prefetch(5)

    channel.consume('minha_fila', (data) => {
        
        console.log(data.content.toString())

        /*setTimeout(() => {
            channel.ack(data)
        }, 5000)
    */
    })
}

main()  