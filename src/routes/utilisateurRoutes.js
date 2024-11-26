import express from 'express'
import {
  creerUtilisateur,
  afficherUtilisateurParId,
  afficherUtilisateurs,
  supprimerUtilisateur,
  mettreAjourUtilisateur,
  updateCurentUser,
  modifyPassword,
  afficherMedecinDisponible
} from '../controllers/utilisateurController.js'
import {
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
} from '../validators/UtilisateurValidator.js'
import {
  authMiddleware, adminMiddleware, medecinMiddleware,
} from '../middlewares/authentification.js'
import { validationResult } from 'express-validator'

const router = express.Router()

// Fonction de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Routes pour les utilisateurs avec le chemin "/utilisateurs"

// Créer un nouvel utilisateur
router.post(
  '/utilisateurs',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Utilisez ceci pour restreindre la création à des utilisateurs avec le rôle ADMIN
  creerUtilisateurValidator,
  validate,
  creerUtilisateur
)

// Mettre à jour un utilisateur existant
router.put(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Assurez-vous que les administrateurs peuvent mettre à jour les utilisateurs
  mettreAjourUtilisateurValidator,
  validate,
  mettreAjourUtilisateur
)

// Supprimer un utilisateur
router.delete(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Assurez-vous que les administrateurs peuvent supprimer les utilisateurs
  supprimerUtilisateurValidator,
  validate,
  supprimerUtilisateur
)

// Récupérer un utilisateur par ID
router.get(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Décommentez si seulement les admins doivent voir les détails d'un utilisateur
  afficherUtilisateurParId
)

// Récupérer tous les utilisateurs
router.get(
  '/utilisateurs',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Décommentez si seulement les admins doivent voir tous les utilisateurs
  afficherUtilisateurs
)

router.put(
  '/user/update',
    // medecinMiddleware,
  authMiddleware,
  adminMiddleware,
  updateCurentUser // Assurez-vous que les administrateurs peuvent mettre à jour les utilisateurs
  
)

router.put(
  '/user/change-password',
    // medecinMiddleware,
  authMiddleware,
  adminMiddleware,
  modifyPassword // Assurez-vous que les administrateurs peuvent mettre à jour les utilisateurs
  
)
router.get(
  '/medecin',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, // Décommentez si seulement les admins doivent voir les détails d'un utilisateur
  afficherMedecinDisponible
)

export default router
