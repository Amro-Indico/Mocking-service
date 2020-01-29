import { Router } from 'express'
import getFilesInAlbum from './getFilesInAlbum'
import updateMetadataOnFile from './updateMetadataOnFile'
import createNewAlbum from './createNewAlbum'
import getAlbums from './getAlbums'

const router = Router()

router.get('/:aid', getFilesInAlbum)
router.get('/:aid/metadata', updateMetadataOnFile)
router.post('/', createNewAlbum)
router.get('', getAlbums)
export default router
