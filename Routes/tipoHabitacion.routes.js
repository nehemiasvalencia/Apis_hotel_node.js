import express from 'express'
import {
  getTipoHabitaciones,
  getTipoHabitacionById,
  createTipoHabitacion,
  updateTipoHabitacion,
  deleteTipoHabitacion
} from '../Controller/tipoHabitacion.controller.js'

const router = express.Router()

router.get('/', getTipoHabitaciones)
router.get('/:id', getTipoHabitacionById)
router.post('/', createTipoHabitacion)
router.put('/:id', updateTipoHabitacion)
router.delete('/:id', deleteTipoHabitacion)

export default router
