import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function durable() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    await channel.assertQueue("prioridade", {
        maxPriority: 5
    });

    /*for (let i = 0; i < 10; i++) {
        channel.publish('', 'prioridade', Buffer.from('Mensagem padrao sem prioridade'))
    }*/


    channel.publish('', 'prioridade', Buffer.from('Mensagem  prioridade'), {
        priority: 2
    })


    channel.publish('', 'durable', Buffer.from("Mensagem duravel"), {persistent: true});
    channel.publish('', 'not_durable', Buffer.from("Mensagem nao duravel"));


    await channel.close()
    await connection.close()

}


durable()