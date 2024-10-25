import express from 'express';
import rendezVousController from '../controllers/rendezVousController.js';
import {
  createRendezVous,
  updateRendezVous,
  getRendezVousById,
  deleteRendezVous,
} from '../validators/rendezVousValidator.js';
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

// Routes pour les rendez-vous avec le préfixe /rendezvous
router.post(
  '/rendezvous',
  createRendezVous,
  validate,
  rendezVousController.createRendezVous
);

router.put(
  '/rendezvous/:id',
  updateRendezVous,
  validate,
  rendezVousController.updateRendezVous
);

router.delete(
  '/rendezvous/:id',
  deleteRendezVous,
  validate,
  rendezVousController.deleteRendezVous
);

router.get(
  '/rendezvous/:id',
  getRendezVousById,
  validate,
  rendezVousController.getRendezVousById
);

router.get(
  '/rendezvous',
  rendezVousController.getAllRendezVous
);

export default router;
