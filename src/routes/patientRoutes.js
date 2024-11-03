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
router.post(
  '/patients',
  // authMiddleware,         // Authentification requise
  // adminMiddleware,        // Accès restreint aux administrateurs
  createPatient,
  validate,
  patientController.createPatient
);

router.put(
  '/patients/:id',
  // authMiddleware,         // Authentification requise
  // adminMiddleware,        // Accès restreint aux administrateurs
  updatePatient,
  validate,
  patientController.updatePatient
);

router.delete(
  '/patients/:id',
  // authMiddleware,         // Authentification requise
  // adminMiddleware,        // Accès restreint aux administrateurs
  deletePatient,
  validate,
  patientController.deletePatient
);

router.get(
  '/patients/:id',
  // authMiddleware,         // Authentification requise
  // adminMiddleware,        // Accès restreint aux administrateurs
  getPatientById,
  validate,
  patientController.getPatientById
);

router.get(
  '/patients',
  // authMiddleware,         // Authentification requise
  // adminMiddleware,        // Accès restreint aux administrateurs
  patientController.getAllPatients
);

export default router;
