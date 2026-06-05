import express from 'express'
import {
  getFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
} from '../Controller/factura.controller.js'

const router = express.Router()

router.get('/', getFacturas)
router.get('/:id', getFacturaById)
router.post('/', createFactura)
router.put('/:id', updateFactura)
router.delete('/:id', deleteFactura)

export default router
