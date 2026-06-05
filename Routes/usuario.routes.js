import { Router } from 'express'
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,loginUsuario
} from '../Controller/usuario.controller.js'

const router = Router()

router.post('/login', loginUsuario)
router.get('/', getUsuarios)
router.get('/:id', getUsuarioById)
router.post('/', createUsuario)
router.put('/:id', updateUsuario)
router.delete('/:id', deleteUsuario)

export default router
