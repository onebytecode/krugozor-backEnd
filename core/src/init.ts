import { Server } from './server/server'
import { Database } from './database/database'

const ENV = process.env.NODE_ENV || 'dev'

export default async function () {
    
    console.log('Init applicaction')

    const server: Server = new Server(8080)
    const db: Database   = new Database(ENV)

    server.assignMorgan()
    server.assignDefaultRoutes()
    db.getMongoose()
        .then(mongoose => {
            server.run()
        })
        .catch(err => {
            console.error(err)
        })
}