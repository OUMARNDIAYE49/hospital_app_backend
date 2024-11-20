import { body, param } from 'express-validator';

export const createRendezVous = [
  body('patient_id')
    .isInt()
    .withMessage('ID du patient invalide'),
  body('medecin_id')
    .isInt()
    .withMessage('ID du médecin invalide'),
  body('admin_id')
    .optional()
    .isInt()
    .withMessage("ID de l'utilisateur invalide"),
  body('date_debut')
    .optional()
    .isISO8601()
    .withMessage('La date de début doit être au format valide'),
  body('date_fin')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être au format valide'),
  body('status')
    .notEmpty()
    .withMessage('Le statut du rendez-vous est obligatoire')
    .isIn(['en attente', 'confirmé', 'annulé'])
    .withMessage("Le statut doit être l'un des suivants : en attente, confirmé, annulé")
];

export const updateRendezVous = [
  param('id')
    .isInt()
    .withMessage('ID rendez-vous invalide'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('La date du rendez-vous doit être au format valide'),
  body('date_debut')
    .optional()
    .isISO8601()
    .withMessage('La date de début doit être au format valide'),
  body('date_fin')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être au format valide'),
  body('status')
    .optional()
    .isIn(['en attente', 'confirmé', 'annulé'])
    .withMessage("Le statut doit être l'un des suivants : en attente, confirmé, annulé"),

];

export const getRendezVousById = [
  param('id')
    .isInt()
    .withMessage('ID rendez-vous invalide')
];

export const deleteRendezVous = [
  param('id')
    .isInt()
    .withMessage('ID rendez-vous invalide')
];
