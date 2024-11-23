
import { body, param } from 'express-validator'

export const createSpecialite = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom de la spécialité est obligatoire')
    .isLength({ min :3, max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères')
]

export const updateSpecialite = [
  param('id').isInt().withMessage('ID spécialité invalide'),

  body('nom')
    .optional()
    .isLength({ min :3, max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères')
]

export const getSpecialiteById = [
  param('id').isInt().withMessage('ID spécialité invalide')
]

export const deleteSpecialite = [
  param('id').isInt().withMessage('ID spécialité invalide')
]
