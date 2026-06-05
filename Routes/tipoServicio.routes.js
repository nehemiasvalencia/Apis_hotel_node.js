import express from 'express'
import {
  getTipoServicios,
  getTipoServicioById,
  createTipoServicio,
  updateTipoServicio,
  deleteTipoServicio
} from '../Controller/tipoServicio.controller.js'

const router = express.Router()

router.get('/', getTipoServicios) 
router.get('/:id', getTipoServicioById) 
router.post('/', createTipoServicio)
router.put('/:id', updateTipoServicio) 
router.delete('/:id', deleteTipoServicio) 

export default router
