import jwt from 'jsonwebtoken'

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Accès refusé. Aucun token fourni.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.utilisateur = decoded
    next()
  } catch {
    return res.status(400).json({ message: 'Token invalide.' })
  }
}

// Middleware pour vérifier les permissions d'admin
const adminMiddleware = (req, res, next) => {
  if (req.utilisateur.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'Accès interdit. Administrateurs uniquement.' })
  }
  next()
}

// Middleware pour vérifier les permissions de MEDECIN
const medecinMiddleware = (req, res, next) => {
  if (req.utilisateur.role === 'MEDECIN') {
    // Ajoute la restriction pour n'afficher que les rendez-vous de ce médecin
    req.restrictionMedecin = { utilisateurId: req.utilisateur.utilisateurId }
  }
  next()
}

export { authMiddleware, adminMiddleware, medecinMiddleware }
