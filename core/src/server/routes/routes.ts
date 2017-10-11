import { Router } from 'express'
import { Api }    from './api/v1/api' 

export function Routes(): Router {
    const router: Router = Router()

    router.route('/')
        .get(function(req, res) {
            res.send('Very welcome to Anticafe API!')
        })

    router.use('/gql', Api())

    return router
}