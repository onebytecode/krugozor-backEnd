import * as express from 'express'
import * as color   from 'colors'
import * as morgan  from 'morgan'
import { Router }   from 'express'

import { Routes }   from './routes/routes'

export class Server {
    app:    express
    port:   Number
    routes: Router
    env: string 

    constructor(port: Number) {
        this.app = express()
        this.port = port 
        this.routes = Routes()
        this.env = process.env.NODE_ENV || 'dev'
    }

    assignMorgan() {
        this.app.use(morgan('dev'))
    }

    assignDefaultRoutes() {
        this.app.use(this.routes)
    }

    run(): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, () => {
                resolve(true)
                if (this.env !== 'test' ) console.log(color.cyan(`App listen on ::${this.port}::`))
            })
        })
    }
}