import * as express from 'express'
import * as color   from 'colors'
import * as morgan  from 'morgan'
import { Router }   from 'express'

import { Routes }   from './routes/routes'

export class Server {
    app:    express
    port:   Number
    routes: Router


    constructor(port: Number) {
        this.app = express()
        this.port = port 
        this.routes = Routes()
    }

    assignMorgan() {
        this.app.use(morgan('dev'))
    }

    assignDefaultRoutes() {
        this.app.use(this.routes)
    }

    run() {
        this.app.listen(this.port, () => {
            
            console.log(color.cyan(`App listen on ::${this.port}::`))
        })
    }
}