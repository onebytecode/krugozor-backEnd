import { Router } from 'express'

export function Routes(): Router {
    const router: Router = Router()

    router.route('/')
        .get(function(req, res) {
            res.send('Hello, world! ...and now in focken typescript!')
        })

    return router
}