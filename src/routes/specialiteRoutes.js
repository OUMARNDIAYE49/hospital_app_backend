import express from 'express';
import specialiteController from '../controllers/specialiteController.js';
import {
  createSpecialite,
  updateSpecialite,
  getSpecialiteById,
  deleteSpecialite
} from '../validators/specialiteValidator.js';
import { validationResult } from 'express-validator';
import { authMiddleware, medecinMiddleware,  adminMiddleware } from '../middlewares/authentification.js';

const router = express.Router();


// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes pour les spécialités avec le préfixe /specialites (accès restreint aux administrateurs)
router.post(
  '/specialites',
  authMiddleware,        // Authentification requise
  adminMiddleware,       // Accès réservé aux administrateurs
  // medecinMiddleware,
  createSpecialite,
  validate,
  specialiteController.createSpecialite
);

router.put(
  '/specialites/:id',
  authMiddleware,        // Authentification requise
  adminMiddleware,       // Accès réservé aux administrateurs
  // medecinMiddleware,
  updateSpecialite,
  validate,
  specialiteController.updateSpecialite
);

router.delete(
  '/specialites/:id',
  authMiddleware,        // Authentification requise
  adminMiddleware,       // Accès réservé aux administrateurs
  // medecinMiddleware,
  deleteSpecialite,
  validate,
  specialiteController.deleteSpecialite
);

router.get(
  '/specialites/:id',
  authMiddleware,        // Authentification requise
  // medecinMiddleware,
  adminMiddleware,       // Accès réservé aux administrateurs
  getSpecialiteById,
  validate,
  specialiteController.getSpecialiteById
);

router.get(
  '/specialites',
  authMiddleware,        // Authentification requise
  // medecinMiddleware,
  adminMiddleware,       // Accès réservé aux administrateurs
  specialiteController.getSpecialites
);

export default router;
