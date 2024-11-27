import express from 'express'
import {
  creerUtilisateur,
  afficherUtilisateurParId,
  afficherUtilisateurs,
  supprimerUtilisateur,
  mettreAjourUtilisateur,
  updateCurentUser,
  changePassword,
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

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.post(
  '/utilisateurs',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, 
  creerUtilisateurValidator,
  validate,
  creerUtilisateur
)

router.put(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, 
  mettreAjourUtilisateurValidator,
  validate,
  mettreAjourUtilisateur
)

router.delete(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, 
  supprimerUtilisateurValidator,
  validate,
  supprimerUtilisateur
)

router.get(
  '/utilisateurs/:id',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, 
  afficherUtilisateurParId
)

router.get(
  '/utilisateurs',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware, 
  afficherUtilisateurs
)

router.put(
  '/user/update',
    // medecinMiddleware,
  authMiddleware,
  adminMiddleware,
  updateCurentUser
  
)

router.put(
  '/user/change-password',
    // medecinMiddleware,
  authMiddleware,
  adminMiddleware,
  changePassword 
  
)
router.get(
  '/medecin',
  // medecinMiddleware,
  authMiddleware,
  adminMiddleware,
  afficherMedecinDisponible
)

export default router
