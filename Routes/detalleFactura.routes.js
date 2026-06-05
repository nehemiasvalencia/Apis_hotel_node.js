import express from 'express'
import {
  getDetallesFactura,
  getDetalleFacturaById,
  createDetalleFactura,
  updateDetalleFactura,
  deleteDetalleFactura
} from '../Controller/detalleFactura.controller.js'

const router = express.Router()

router.get('/', getDetallesFactura)
router.get('/:id', getDetalleFacturaById)
router.post('/', createDetalleFactura)
router.put('/:id', updateDetalleFactura)
router.delete('/:id', deleteDetalleFactura)

export default router
