import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function exchange() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    await channel.assertExchange('udemy_exchange', 'direct')

    //Criar uma fila constumizada 

    await channel.assertQueue('udemy_push_notification', {
        durable: true,
    })

    await channel.assertQueue('udemy_email_notification', {
        durable: true,
    })


    //Binding - linkar fila com exchange 

    await channel.bindQueue('udemy_push_notification', 'udemy_exchange', 'novo_curso')
    await channel.bindQueue('udemy_email_notification', 'udemy_exchange', 'novo_curso')
    await channel.bindQueue('udemy_email_notification', 'udemy_exchange', 'diploma')
    //await channel.unbindQueue('udemy_push_notification', 'udemy_exchange')



    //publicando mensagem com o routeamento
    channel.publish('udemy_exchange', 'diploma', Buffer.from('teste Mensagem'))

    await channel.close()
    await connection.close()



}


exchange()