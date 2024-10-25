import jwt from 'jsonwebtoken';

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' }); // Aligné avec le message de référence
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.utilisateur = decoded; // Conserver `req.utilisateur` comme dans la référence
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token invalide.' }); // Utiliser code 400 pour "Token invalide" comme dans la référence
    }
};

// Middleware pour vérifier les permissions d'admin
const adminMiddleware = (req, res, next) => {
    if (req.utilisateur.role !== 'ADMIN') { // Aligner la vérification avec le rôle "ADMIN" de la référence
        return res.status(403).json({ message: 'Accès interdit. Administrateurs uniquement.' }); // Aligné avec le message de référence
    }
    next();
};

export { authMiddleware, adminMiddleware };
