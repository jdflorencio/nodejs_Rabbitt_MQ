import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));
import { randomUUID } from 'crypto';

async function exclusive() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    await channel.assertQueue('exclusive', {
        exclusive: true
    })

    // criando o consumidor e limnitando e consumindo a mensagem da fila
    channel.prefetch(3)
    channel.consume("exclusive", (data) => {
        console.log(data.content.toString())
        setTimeout(() => channel.ack(data), 1000)

    })

    //adicionando a mensagem a fila temporaria
    for (let i = 0; i < 10; i++) {
        channel.publish('', 'exclusive', Buffer.from(`Mensagem exclusive: ${randomUUID()}` ))
    }

}


exclusive()