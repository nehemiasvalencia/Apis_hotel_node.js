import express from 'express'
import {
  getRolesPersonales,
  getRolPersonalById,
  createRolPersonal,
  updateRolPersonal,
  deleteRolPersonal
} from '../Controller/rolesPersonales.controller.js'

const router = express.Router()

router.get('/', getRolesPersonales)
router.get('/:id', getRolPersonalById)
router.post('/', createRolPersonal)
router.put('/:id', updateRolPersonal)
router.delete('/:id', deleteRolPersonal)

export default router
