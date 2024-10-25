import express from 'express';
import {
  creerUtilisateur,
  afficherUtilisateurParId,
  afficherUtilisateurs,
  supprimerUtilisateur,
  mettreAjourUtilisateur
} from '../controllers/UtilisateurController.js'; // Importation des contrôleurs comme dans la référence
import {
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
} from '../validators/UtilisateurValidator.js'; // Correction des noms de validateurs pour être cohérents avec la référence
import { authMiddleware, adminMiddleware } from '../middlewares/authentification.js'; // Correction du nom du fichier pour correspondre à la référence
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

// Routes pour les utilisateurs avec le chemin "/utilisateurs"

// Créer un nouvel utilisateur
router.post(
  '/utilisateurs',
  // authMiddleware,               // Middleware pour vérifier l'authentification
  // adminMiddleware,              // Middleware pour vérifier les droits d'administration
  // creerUtilisateurValidator,    // Validation des données d'entrée (correction du nom du validateur)
  // validate,                     // Vérification des erreurs de validation
  creerUtilisateur              // Utilisation du contrôleur importé (correction du nom de la fonction)
);

// Mettre à jour un utilisateur existant
router.put(
  '/utilisateurs/:id',
  // authMiddleware,
  // adminMiddleware,
  // mettreAjourUtilisateurValidator, // Validation des données d'entrée (correction du nom du validateur)
  // validate,
  mettreAjourUtilisateur            // Utilisation du contrôleur importé (correction du nom de la fonction)
);

// Supprimer un utilisateur
router.delete(
  '/utilisateurs/:id',
  // authMiddleware,
  // adminMiddleware,
  supprimerUtilisateurValidator,   // Validation des données d'entrée (correction du nom du validateur)
  validate,
  supprimerUtilisateur              // Utilisation du contrôleur importé (correction du nom de la fonction)
);

// Récupérer un utilisateur par ID
router.get(
  '/utilisateurs/:id',
  // authMiddleware,
  // adminMiddleware,
  afficherUtilisateurParId         // Utilisation du contrôleur importé (correction du nom de la fonction)
);

// Récupérer tous les utilisateurs
router.get(
  '/utilisateurs',
  // authMiddleware,
  // adminMiddleware,
  afficherUtilisateurs             // Utilisation du contrôleur importé (ajout de la route manquante)
);

export default router;
