import express from 'express'
import {
  getCheckouts,
  getCheckoutById,
  createCheckout,
  updateCheckout,
  deleteCheckout
} from '../Controller/checkout.controller.js'

const router = express.Router()

router.get('/', getCheckouts)
router.get('/:id', getCheckoutById)
router.post('/', createCheckout)
router.put('/:id', updateCheckout)
router.delete('/:id', deleteCheckout)

export default router
