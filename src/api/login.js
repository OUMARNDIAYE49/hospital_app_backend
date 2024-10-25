import express from 'express';
import bcrypt from 'bcryptjs'; // Utiliser bcryptjs pour la compatibilité
import jwt from 'jsonwebtoken'; // Pour générer les tokens JWT
import prisma from '../config/database.js'; // Assurez-vous que le chemin est correct

const router = express.Router();

// Fonction pour gérer la connexion
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const utilisateur = await prisma.utilisateurs.findUnique({ // Utiliser 'utilisateur' au lieu de 'utilisateurs'
      where: { email },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" }); // Changer le code d'état à 404 pour un utilisateur non trouvé
    }

    // Comparer le mot de passe fourni avec le mot de passe haché
    const passwordValide = await bcrypt.compare(password, utilisateur.password); // Renommer la variable pour correspondre à la référence
    if (!passwordValide) {
      return res.status(401).json({ message: "Mot de passe incorrect" }); // Modifier le message d'erreur
    }

    // Générer un token JWT
    const token = jwt.sign(
      { utilisateurId: utilisateur.id, role: utilisateur.role }, // Renommer 'id' à 'utilisateurId' pour correspondre à la référence
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token }); // Retourner le code d'état 200
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error }); // Changer le message d'erreur
  }
});

export default router;
