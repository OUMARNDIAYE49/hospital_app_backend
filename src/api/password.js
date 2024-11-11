import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Vérification de la présence de l'email
  if (!email) {
    return res.status(400).json({ message: "L'email est requis pour réinitialiser le mot de passe." });
  }

  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const token = jwt.sign(
      { utilisateurId: utilisateur.id },
      process.env.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: "2h" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      to: utilisateur.email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Réinitialisez votre mot de passe en cliquant sur le lien suivant :</p>
             <a href="${resetUrl}">${resetUrl}</a>`
    });

    res.status(200).json({
      message: "L'email de réinitialisation du mot de passe a été envoyé."
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation.",
      error
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id: decoded.utilisateurId }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.utilisateurs.update({
      where: { id: utilisateur.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      message: "Le mot de passe a été mis à jour avec succès."
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(400).json({
      message: "Le token est invalide ou a expiré.",
      error
    });
  }
});

export default router;
