import express from 'express'
import {
  getReservaServicios,
  getReservaServicioById,
  createReservaServicio,
  updateReservaServicio,
  deleteReservaServicio
} from '../Controller/reservaServicios.controller.js'

const router = express.Router()

router.get('/', getReservaServicios)
router.get('/:id', getReservaServicioById)
router.post('/', createReservaServicio)
router.put('/:id', updateReservaServicio)
router.delete('/:id', deleteReservaServicio)

export default router
