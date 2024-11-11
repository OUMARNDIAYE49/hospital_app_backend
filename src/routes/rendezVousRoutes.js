import express from 'express'
import rendezVousController from '../controllers/rendezVousController.js'
import {
  createRendezVous,
  updateRendezVous,
  getRendezVousById,
  deleteRendezVous
} from '../validators/rendezVousValidator.js'
import { validationResult } from 'express-validator'
import { authMiddleware, adminMiddleware, medecinMiddleware } from '../middlewares/authentification.js'

const router = express.Router()

// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Routes pour les rendez-vous avec les autorisations et les validations

// Route pour obtenir tous les rendez-vous (ADMIN et MEDECIN)
router.get(
  '/rendezvous',
  // authMiddleware,
  // medecinMiddleware, // Accessible pour les MEDECIN et ADMIN
  rendezVousController.getAllRendezVous
)

// Route pour obtenir un rendez-vous par ID (ADMIN et MEDECIN)
router.get(
  '/rendezvous/:id',
  // authMiddleware,
  // medecinMiddleware, // Accessible pour les MEDECIN et ADMIN
  getRendezVousById, // Validation des données
  validate,
  rendezVousController.getRendezVousById
)

// Route pour créer un rendez-vous (ADMIN seulement)
router.post(
  '/rendezvous',
  authMiddleware,
  adminMiddleware, // Restriction pour les ADMIN uniquement
  createRendezVous, // Validation des données
  validate,
  rendezVousController.createRendezVous
)

// Route pour mettre à jour un rendez-vous (ADMIN seulement)
router.put(
  '/rendezvous/:id',
  authMiddleware,
  adminMiddleware, // Restriction pour les ADMIN uniquement
  updateRendezVous, // Validation des données
  validate,
  rendezVousController.updateRendezVous
)

// Route pour supprimer un rendez-vous (ADMIN seulement)
router.delete(
  '/rendezvous/:id',
  authMiddleware,
  adminMiddleware, // Restriction pour les ADMIN uniquement
  deleteRendezVous, // Validation des données
  validate,
  rendezVousController.deleteRendezVous
)

export default router
