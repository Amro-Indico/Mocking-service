import { Router } from 'express'
import createNewMediaFileInAlbums from './createNewMediaFileInAlbum'

const router = Router()

router.post('/:aid/files', createNewMediaFileInAlbums)
export default router
