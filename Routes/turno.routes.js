import express from 'express'
import {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} from '../Controller/turno.controller.js'

const router = express.Router()

router.get('/', getTurnos)
router.get('/:id', getTurnoById)
router.post('/', createTurno)
router.put('/:id', updateTurno)
router.delete('/:id', deleteTurno)

export default router
