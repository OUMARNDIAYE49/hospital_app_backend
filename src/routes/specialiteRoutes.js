import express from 'express'
import specialiteController from '../controllers/specialiteController.js'
import {
  createSpecialite,
  updateSpecialite,
  getSpecialiteById,
  deleteSpecialite
} from '../validators/specialiteValidator.js'
import { validationResult } from 'express-validator'

const router = express.Router()

// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Routes pour les spécialités avec le préfixe /specialites
router.post(
  '/specialites',
  createSpecialite,
  validate,
  specialiteController.createSpecialite
)

router.put(
  '/specialites/:id',
  updateSpecialite,
  validate,
  specialiteController.updateSpecialite
)

router.delete(
  '/specialites/:id',
  deleteSpecialite,
  validate,
  specialiteController.deleteSpecialite
)

router.get(
  '/specialites/:id',
  getSpecialiteById,
  validate,
  specialiteController.getSpecialiteById
)

router.get('/specialites', specialiteController.getSpecialites)

export default router
