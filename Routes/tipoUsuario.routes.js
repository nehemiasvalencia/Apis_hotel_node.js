import { Router } from 'express'
import { 
  getTipoUsuarios,
  getTipoUsuarioById,
  createTipoUsuario,
  updateTipoUsuario,
  deleteTipoUsuario
} from '../Controller/tipoUsuario.controller.js'

const router = Router()

router.get('/', getTipoUsuarios)
router.get('/:id', getTipoUsuarioById)
router.post('/', createTipoUsuario)
router.put('/:id', updateTipoUsuario)
router.delete('/:id', deleteTipoUsuario)

export default router
