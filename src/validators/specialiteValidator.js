// src/validators/specialiteValidator.js
import { body, param } from 'express-validator';

// Validation pour la création d'une spécialité
export const createSpecialite = [
  body('nom')
    .notEmpty().withMessage('Le nom de la spécialité est obligatoire')
    .isLength({ max: 100 }).withMessage('Le nom doit avoir au maximum 100 caractères'),
];

// Validation pour la mise à jour d'une spécialité
export const updateSpecialite = [
  param('id')
    .isInt().withMessage('ID spécialité invalide'),

  body('nom')
    .optional()
    .isLength({ max: 100 }).withMessage('Le nom doit avoir au maximum 100 caractères'),
];

// Validation pour obtenir une spécialité par ID
export const getSpecialiteById = [
  param('id')
    .isInt().withMessage('ID spécialité invalide'),
];

// Validation pour la suppression d'une spécialité
export const deleteSpecialite = [
  param('id')
    .isInt().withMessage('ID spécialité invalide'),
];
