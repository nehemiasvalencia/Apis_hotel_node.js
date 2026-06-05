import express from 'express'
import {
  getTipoMantenimientos,
  getTipoMantenimientoById,
  createTipoMantenimiento,
  updateTipoMantenimiento,
  deleteTipoMantenimiento
} from '../Controller/tipoMantenimiento.controller.js'

const router = express.Router()

router.get('/', getTipoMantenimientos) 
router.get('/:id', getTipoMantenimientoById) 
router.post('/', createTipoMantenimiento) 
router.put('/:id', updateTipoMantenimiento) 
router.delete('/:id', deleteTipoMantenimiento) 

export default router
