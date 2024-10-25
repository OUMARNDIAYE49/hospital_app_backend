import { body, param } from 'express-validator';

// Validation pour la création d'un rendez-vous
export const createRendezVous = [
  body('patientId')
    .isInt().withMessage('ID du patient invalide'),
  body('utilisateurId')
    .isInt().withMessage('ID de l\'utilisateur invalide'),
  body('date')
    .isISO8601().withMessage('La date du rendez-vous doit être au format valide'),
  body('status')
    .notEmpty().withMessage('Le statut du rendez-vous est obligatoire')
    .isIn(['en attente', 'confirmé', 'annulé']).withMessage('Le statut doit être l\'un des suivants : en attente, confirmé, annulé'),
];

// Validation pour la mise à jour d'un rendez-vous
export const updateRendezVous = [
  param('id')
    .isInt().withMessage('ID rendez-vous invalide'),
  body('date')
    .optional()
    .isISO8601().withMessage('La date du rendez-vous doit être au format valide'),
  body('status')
    .optional()
    .isIn(['en attente', 'confirmé', 'annulé']).withMessage('Le statut doit être l\'un des suivants : en attente, confirmé, annulé'),
];

// Validation pour obtenir un rendez-vous par ID
export const getRendezVousById = [
  param('id')
    .isInt().withMessage('ID rendez-vous invalide'),
];

// Validation pour la suppression d'un rendez-vous
export const deleteRendezVous = [
  param('id')
    .isInt().withMessage('ID rendez-vous invalide'),
];
