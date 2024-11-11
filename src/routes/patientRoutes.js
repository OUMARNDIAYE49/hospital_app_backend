import express from 'express';
import patientController from '../controllers/patientController.js';
import {
  createPatient,
  updatePatient,
  getPatientById,
  deletePatient
} from '../validators/patientValidator.js';
import { validationResult } from 'express-validator';
import { authMiddleware, adminMiddleware } from '../middlewares/authentification.js';

const router = express.Router();

// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes pour les patients avec le préfixe /patients (réservées aux administrateurs)

// Créer un patient (admin uniquement)
router.post(
  '/patients',
  authMiddleware,         // Authentification requise
  adminMiddleware,        // Accès restreint aux administrateurs
  createPatient,
  validate,
  patientController.createPatient
);

// Mettre à jour un patient (admin uniquement)
router.put(
  '/patients/:id',
  authMiddleware,         // Authentification requise
  adminMiddleware,        // Accès restreint aux administrateurs
  updatePatient,
  validate,
  patientController.updatePatient
);

// Supprimer un patient (admin uniquement)
router.delete(
  '/patients/:id',
  authMiddleware,         // Authentification requise
  adminMiddleware,        // Accès restreint aux administrateurs
  deletePatient,
  validate,
  patientController.deletePatient
);

// Récupérer un patient par ID (admin uniquement)
router.get(
  '/patients/:id',
  authMiddleware,         // Authentification requise
  adminMiddleware,        // Accès restreint aux administrateurs
  getPatientById,
  validate,
  patientController.getPatientById
);

// Récupérer tous les patients (admin uniquement)
router.get(
  '/patients',
  authMiddleware,         // Authentification requise
  adminMiddleware,        // Accès restreint aux administrateurs
  patientController.getAllPatients
);

export default router;
