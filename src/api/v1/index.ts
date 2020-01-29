import { Router } from 'express'
import albums from './albums'

const router = Router()

router.use('/:aid', albums)
export default router
