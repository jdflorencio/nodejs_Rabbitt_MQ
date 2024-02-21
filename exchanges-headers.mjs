import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function exchangeHeaders() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();


    await channel.assertExchange('notify_headers', 'headers')


    await channel.assertQueue('email_notifications')
    await channel.assertQueue('sms_notifications')
    await channel.assertQueue('push_notifications')

    //binds

    await channel.bindQueue('email_notifications', 'notify_headers',  '', {
        'notification_type': 'email'
    })

    await channel.bindQueue('sms_notifications', 'notify_headers',  '', {
        'notification_type': 'sms'
    })

    await channel.bindQueue('push_notifications', 'notify_headers',  '', {
        'notification_type': 'push'
    })

    // Exchange fanout - para mandar mensagem para todas as nossas filas

    await channel.assertExchange('notify_fanout', 'fanout')
    
    await channel.bindQueue('email_notifications', 'notify_fanout')
    await channel.bindQueue('sms_notifications', 'notify_fanout')
    await channel.bindQueue('push_notifications', 'notify_fanout')

    await channel.bindExchange('notify_fanout', 'notify_headers', '', {
        'notification_type': 'all'
    })


    // Publicando mensagem
    channel.publish('notify_headers', '', Buffer.from('meu header'), {
        headers: {
            notification_type: 'sms'
        }
    })






    await channel.close()
    await connection.close()
}



exchangeHeaders()