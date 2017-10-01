import { Router } from 'express'
import { Api }    from './api/v1/api' 

export function Routes(): Router {
    const router: Router = Router()

    router.route('/')
        .get(function(req, res) {
            res.send('Hello, world! ...and now in focken typescript!')
        })

    router.use('/gql', Api())

    return router
}