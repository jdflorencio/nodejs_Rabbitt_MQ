import amqp from 'amqplib'
import { randomUUID } from 'crypto';
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function exchangeFanout() {
    const connection = await amqp.connect({...config, vhost: 'fanout-example'})
    const channel = await connection.createChannel();


    // fila email notification
    // sms_notification
    // push_notification

    //quando houver alguma suspeita de login enviar mensagens para todos

    //criando recursos se nao existir
    await channel.assertExchange('notifications', 'fanout')
    await channel.assertQueue('email_notifications')
    await channel.assertQueue('sms_notifications')
    await channel.assertQueue('push_notifications')



    //Binds
    await channel.bindQueue('email_notifications', 'notifications', '')
    await channel.bindQueue('sms_notifications', 'notifications', '')
    await channel.bindQueue('push_notifications', 'notifications', '')

    channel.publish(`notifications`, '', Buffer.from(`sua conta teve uma atividade suspeita -  ${randomUUID()}`))

    await channel.close()
    await connection.close()



}


exchangeFanout()