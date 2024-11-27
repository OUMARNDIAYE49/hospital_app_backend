import { body, param } from 'express-validator';

export const createPatient = [
  body('nom')
    .notEmpty()
    .trim()
    .withMessage('Le nom est obligatoire')
    .isLength({min: 3, max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('telephone')
    .notEmpty()
    .withMessage('Le téléphone est obligatoire')
    .matches(/^\d+$/)
    .withMessage('Le téléphone doit contenir uniquement des chiffres')
    .isLength({ min: 8, max: 20 })
    .withMessage('Le téléphone doit contenir entre 8 et 20 caractères'),
  body('email')
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("L'email doit être valide et se terminer par '@gmail.com'")
    .isLength({ min: 10, max: 50 })
    .withMessage("L'email doit contenir entre 10 et 50 caractères"),
  body('date_naissance')
    .notEmpty()
    .withMessage('La date de naissance est obligatoire')
    .isISO8601()
    .withMessage('La date de naissance doit être une date valide au format AAAA-MM-JJ')
    .toDate(),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères"),
];

export const updatePatient = [
  param('id').isInt().withMessage('ID patient invalide'),
  body('nom')
    .optional()
    .trim()
    .isLength({min: 3, max: 100 })
    .withMessage('Le nom doit avoir au maximum 100 caractères'),
  body('telephone')
    .optional()
    .matches(/^\d+$/)
    .withMessage('Le téléphone doit contenir uniquement des chiffres')
    .isLength({ min: 8, max: 20 })
    .withMessage('Le téléphone doit contenir entre 8 et 20 caractères'),
  body('email')
    .optional()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("L'email doit être valide et se terminer par '@gmail.com'")
    .isLength({ min: 10, max: 50 })
    .withMessage("L'email doit contenir entre 10 et 50 caractères"),
  body('date_naissance')
    .optional()
    .isISO8601()
    .withMessage('La date de naissance doit être une date valide au format AAAA-MM-JJ')
    .toDate(),
  body('adresse')
    .optional()
    .isLength({ max: 255 })
    .withMessage("L'adresse ne doit pas dépasser 255 caractères"),
];

export const getPatientById = [
  param('id').isInt().withMessage('ID patient invalide'),
];

export const deletePatient = [
  param('id').isInt().withMessage('ID patient invalide'),
];
