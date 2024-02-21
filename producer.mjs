import amqp from 'amqplib';
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function main() {

    const connection = await amqp.connect(config)

    const channel = await connection.createChannel();
    
    await channel.assertQueue('minha_fila', {
        durable: true,
    })
    
    
    //channel.publish('', 'minha_fila', Buffer.from('Minha mensagem'))
    let i = 0;
    for ( i = 0; i < 1000; i++) {
        channel.sendToQueue('minha_fila', Buffer.from(`Minha MSG ${i}`))

    }
    await channel.close();
    await connection.close();


}

main();