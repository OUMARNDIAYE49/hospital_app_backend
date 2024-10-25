import express from 'express';
import patientController from '../controllers/patientController.js';
import { createPatient, updatePatient, getPatientById, deletePatient } from '../validators/patientValidator.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes pour les patients avec le préfixe /patients
router.post(
  '/patients',
  createPatient,
  validate,
  patientController.createPatient
);

router.put(
  '/patients/:id',
  updatePatient,
  validate,
  patientController.updatePatient
);

router.delete(
  '/patients/:id',
  deletePatient,
  validate,
  patientController.deletePatient
);

router.get(
  '/patients/:id',
  getPatientById,
  validate,
  patientController.getPatientById
);

router.get(
  '/patients',
  patientController.getAllPatients
);

export default router;
