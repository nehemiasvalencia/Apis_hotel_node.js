import express from 'express'
import {
  getCheckins,
  getCheckinById,
  createCheckin,
  updateCheckin,
  deleteCheckin
} from '../Controller/checkin.controller.js'

const router = express.Router()

router.get('/', getCheckins)
router.get('/:id', getCheckinById)
router.post('/', createCheckin)
router.put('/:id', updateCheckin)
router.delete('/:id', deleteCheckin)

export default router
