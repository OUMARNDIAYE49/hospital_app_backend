import { body, param, validationResult } from 'express-validator'
import prisma from '../config/database.js'
import { StatusCodes } from 'http-status-codes'

const creerUtilisateurValidator = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom est requis.')
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      'Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés.'
    )
    .bail()
    .isLength({ min: 3, max:100})
    .withMessage('Le nom doit contenir au moins 3 caractères.'),

  body('email')
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("L'email doit être valide et se terminer par '@gmail.com'")
      .isLength({min:10, max: 50 })
    .isEmail()
    .withMessage('Doit être un email valide.')
    .bail()
    .custom(async (value) => {
      const utilisateurExistant = await prisma.utilisateurs.findUnique({
        where: { email: value }
      })
      if (utilisateurExistant) {
        throw new Error('Cet email est déjà utilisé.')
      }
      return true
    }),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis.')
    .bail()
    .isLength({ min: 6, max:100 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() })
    }
    next()
  }
]

const mettreAjourUtilisateurValidator = [
  param('id')
    .notEmpty()
    .withMessage("L'id est requis.")
    .bail()
    .isInt()
    .withMessage('ID invalide.') 
    .bail()
    .custom(async (value) => {
      const utilisateur = await prisma.utilisateurs.findUnique({
        where: { id: parseInt(value) } 
      })
      if (!utilisateur) {
        throw new Error('Utilisateur non trouvé.')
      }
      return true
    }),

  body('nom')
    .optional()
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide.')
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      'Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés.'
    )
    .bail()
    .isLength({ min: 3, max:100 })
    .withMessage('Le nom doit contenir au moins 3 caractères.'),

  body('email')
    .optional()
    .isEmail()
    .withMessage("L'email est obligatoire")
  .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
  .withMessage("L'email doit être valide et se terminer par '@gmail.com'")
    .isLength({min:10, max: 50 })
    .withMessage('Doit être un email valide.')
    .bail()
    .custom(async (value, { req }) => {
      const utilisateurExistant = await prisma.utilisateurs.findUnique({
        where: { email: value }
      })
      if (
        utilisateurExistant &&
        utilisateurExistant.id !== parseInt(req.params.id)
      ) {
        throw new Error('Cet email est déjà utilisé.')
      }
      return true
    }),

  body('password')
    .optional()
    .isLength({ min: 6, max:100  })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const utilisateurNonTrouve = errors
        .array()
        .find((error) => error.msg === 'Utilisateur non trouvé.')
      if (utilisateurNonTrouve) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Utilisateur non trouvé' })
      }
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() })
    }
    next()
  }
]

const supprimerUtilisateurValidator = [
  param('id')
    .notEmpty()
    .withMessage("L'id est requis.")
    .bail()
    .isInt()
    .withMessage('ID invalide.')
    .bail()
    .custom(async (value) => {
      const utilisateur = await prisma.utilisateurs.findUnique({
        where: { id: parseInt(value) } 
      })
      if (!utilisateur) {
        throw new Error('Utilisateur non trouvé.') 
      }
      return true
    }),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const utilisateurNonTrouve = errors
        .array()
        .find((error) => error.msg === 'Utilisateur non trouvé.')
      if (utilisateurNonTrouve) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Utilisateur non trouvé' }) 
      }
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() })
    }
    next()
  }
]

export {
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
}
