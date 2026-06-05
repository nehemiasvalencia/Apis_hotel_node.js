import express from 'express'
import {
  getMantenimientos,
  getMantenimientoById,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento
} from '../Controller/mantenimiento.controller.js'

const router = express.Router()

router.get('/', getMantenimientos)
router.get('/:id', getMantenimientoById)
router.post('/', createMantenimiento)
router.put('/:id', updateMantenimiento)
router.delete('/:id', deleteMantenimiento)

export default router
