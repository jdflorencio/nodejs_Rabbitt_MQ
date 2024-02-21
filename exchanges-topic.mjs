import amqp from 'amqplib'
import fs from  'fs';
const config = JSON.parse(fs.readFileSync('./config.json'));

async function exchangeTopic() {
    const connection = await amqp.connect(config)
    const channel = await connection.createChannel();

    // Fila > system_logs
    //logs.(system).info
    //logs.(system.erro)

    await channel.assertExchange('system_exchange', 'topic')
    await channel.assertQueue('system_logs')
    await channel.assertQueue('system_errors')

    await channel.bindQueue('system_logs', 'system_exchange', 'logs.#')
    await channel.bindQueue('system_errors', 'system_exchange', '#.erro')

    await channel.publish('system_exchange', 'logs.system.info', Buffer.from('sistema iniciado'))
    await channel.publish('system_exchange', 'logs.system.erro', Buffer.from('Erro no  sistema'))





   


    await channel.close()
    await connection.close()



}


exchangeTopic()