import { body, param } from 'express-validator'

// Validation pour la création d'un patient
export const createPatient = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom est obligatoire')
    .isLength({ max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('prenom')
    .notEmpty()
    .withMessage('Le prénom est obligatoire')
    .isLength({ max: 100 })
    .withMessage('Le prénom doit avoir au maximum 100 caractères'),
  body('dateNaissance')
    .notEmpty()
    .withMessage('La date de naissance est obligatoire') // Vérifie que le champ est présent
    .bail() // Arrête ici si la validation précédente échoue
    .isISO8601()
    .withMessage(
      'La date de naissance doit être une date valide au format AAAA-MM-JJ'
    )
    .toDate(),
  body('telephone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne doit pas dépasser 20 caractères'),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères")
]

// Validation pour la mise à jour d'un patient
export const updatePatient = [
  param('id').isInt().withMessage('ID patient invalide'),
  body('nom')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('prenom')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Le prénom doit avoir au maximum 100 caractères'),
  body('dateNaissance')
    .optional()
    .isDate()
    .withMessage('La date de naissance doit être une date valide'),
  body('telephone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne doit pas dépasser 20 caractères'),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères")
]

// Validation pour obtenir un patient par ID
export const getPatientById = [
  param('id').isInt().withMessage('ID patient invalide')
]

// Validation pour la suppression d'un patient
export const deletePatient = [
  param('id').isInt().withMessage('ID patient invalide')
]
