import express from 'express'
import {
  getPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal
} from '../Controller/personal.controller.js'

const router = express.Router()

router.get('/', getPersonal)
router.get('/:id', getPersonalById)
router.post('/', createPersonal)
router.put('/:id', updatePersonal)
router.delete('/:id', deletePersonal)

export default router
