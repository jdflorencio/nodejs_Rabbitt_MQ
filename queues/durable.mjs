import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function durable() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    await channel.assertQueue("durable", {
        durable: true
    });

    await channel.assertQueue("not_durable", {
        durable: false
    });

    channel.publish('', 'durable', Buffer.from("Mensagem duravel"), {persistent: true});
    channel.publish('', 'not_durable', Buffer.from("Mensagem nao duravel"));


    await channel.close()
    await connection.close()

}


durable()