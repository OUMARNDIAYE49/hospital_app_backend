import { body, param, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { StatusCodes } from 'http-status-codes';

// Validation pour la création d'un utilisateur
const creerUtilisateurValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom est requis.')
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/).withMessage('Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés.')
    .bail()
    .isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères.'),
  
  body('email')
    .notEmpty().withMessage('L\'email est requis.')
    .bail()
    .isEmail().withMessage('Doit être un email valide.')
    .bail()
    .custom(async (value) => {
      const utilisateurExistant = await prisma.utilisateurs.findUnique({
        where: { email: value },
      });
      if (utilisateurExistant) {
        throw new Error('Cet email est déjà utilisé.');
      }
      return true;
    }),

  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .bail()
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation pour la mise à jour d'un utilisateur
const mettreAjourUtilisateurValidator = [
  param('id')
    .notEmpty().withMessage('L\'id est requis.')
    .bail()
    .isUUID().withMessage('ID invalide.')
    .bail()
    .custom(async (value) => {
      const utilisateur = await prisma.utilisateurs.findUnique({
        where: { id: value },
      });
      if (!utilisateur) {
        throw new Error('L\'utilisateur n\'existe pas.');
      }
      return true;
    }),

  body('nom')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide.')
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/).withMessage('Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés.')
    .bail()
    .isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères.'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Doit être un email valide.')
    .bail()
    .custom(async (value, { req }) => {
      const utilisateurExistant = await prisma.utilisateurs.findUnique({
        where: { email: value },
      });
      if (utilisateurExistant && utilisateurExistant.id !== req.params.id) {
        throw new Error('Cet email est déjà utilisé.');
      }
      return true;
    }),

  body('motDePasse')
    .optional()
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation pour la suppression d'un utilisateur

const supprimerUtilisateurValidator = [
  param('id')
    .notEmpty().withMessage('L\'id est requis.')
    .bail()
    .isInt().withMessage('ID invalide.') // Vérifie si l'ID est un entier
    .bail()
    .custom(async (value) => {
      const utilisateur = await prisma.utilisateurs.findUnique({
        where: { id: parseInt(value) }, // Conversion en entier
      });
      if (!utilisateur) {
        throw new Error('Utilisateur non trouvé.'); // Message d'erreur personnalisé
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Si des erreurs sont présentes, nous traitons le cas de l'utilisateur non trouvé
      const utilisateurNonTrouve = errors.array().find(error => error.msg === 'Utilisateur non trouvé.');
      if (utilisateurNonTrouve) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Utilisateur non trouvé' }); // Réponse JSON
      }
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  }
];


export {
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
};
