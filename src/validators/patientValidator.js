import { body, param } from 'express-validator'

// Validation pour la création d'un patient
export const createPatient = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom est obligatoire')
    .isLength({ max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('telephone')
    .notEmpty()
    .withMessage('Le téléphone est obligatoire')
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne doit pas dépasser 20 caractères'),
  body('email')
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("L'email doit être valide")
    .isLength({ max: 50 })
    .withMessage("L'email ne doit pas dépasser 50 caractères"),
  body('date_naissance') // Utilisation de date_naissance
    .notEmpty()
    .withMessage('La date de naissance est obligatoire') // Vérifie que le champ est présent
    .bail() // Arrête ici si la validation précédente échoue
    .isISO8601()
    .withMessage(
      'La date de naissance doit être une date valide au format AAAA-MM-JJ'
    )
    .toDate(),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères"),
  body('admin_id') // Validation pour admin_id
    .notEmpty()
    .withMessage("L'ID de l'administrateur est obligatoire")
    .isInt()
    .withMessage("L'ID de l'administrateur doit être un entier")
]

// Validation pour la mise à jour d'un patient
export const updatePatient = [
  param('id').isInt().withMessage('ID patient invalide'),
  body('nom')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('telephone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Le téléphone ne doit pas dépasser 20 caractères'),
  body('email')
    .optional()
    .isEmail()
    .withMessage("L'email doit être valide")
    .isLength({ max: 50 })
    .withMessage("L'email ne doit pas dépasser 50 caractères"),
  body('date_naissance') // Utilisation de date_naissance
    .optional()
    .isISO8601()
    .withMessage('La date de naissance doit être une date valide au format AAAA-MM-JJ')
    .toDate(),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères"),
  body('admin_id') // Validation pour admin_id
    .optional()
    .isInt()
    .withMessage("L'ID de l'administrateur doit être un entier")
]

// Validation pour obtenir un patient par ID
export const getPatientById = [
  param('id').isInt().withMessage('ID patient invalide')
]

// Validation pour la suppression d'un patient
export const deletePatient = [
  param('id').isInt().withMessage('ID patient invalide')
]
