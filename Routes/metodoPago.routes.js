import express from 'express'
import {
  getMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
} from '../Controller/metodoPago.controller.js'

const router = express.Router()

router.get('/', getMetodosPago)
router.get('/:id', getMetodoPagoById)
router.post('/', createMetodoPago)
router.put('/:id', updateMetodoPago)
router.delete('/:id', deleteMetodoPago)

export default router
