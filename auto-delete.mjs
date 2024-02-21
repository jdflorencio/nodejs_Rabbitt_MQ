import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));
import { randomUUID } from 'crypto';

async function autoDelete() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    /*await channel.assertQueue('auto_delete', {
        autoDelete: true
    })

    channel.publish('', 'auto_delete', Buffer.from('minha fila auto deletavel'))*/



    channel.consume('auto_delete', (data) => {
        console.log(data.content.toString())
    })







 

}


autoDelete()