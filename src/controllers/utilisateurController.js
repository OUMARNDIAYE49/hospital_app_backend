import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const handleServerError = (res, message, error) => {
  console.error(error);
  return res.status(500).json({ message });
};

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password, specialiteId } = req.body; // Ajout de specialiteId
    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateurExistant = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const nouvelUtilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        email,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN',
        password: hashedPassword,
        specialiteId, // Ajout de specialiteId dans la création
      },
    });

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: nouvelUtilisateur,
    });
  } catch (error) {
    return handleServerError(res, 'Erreur lors de la création de l’utilisateur', error);
  }
};

export const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany();
    return res.status(200).json(utilisateurs);
  } catch (error) {
    return handleServerError(res, 'Erreur lors de la récupération des utilisateurs', error);
  }
};

export const afficherUtilisateurParId = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.status(200).json(utilisateur);
  } catch (error) {
    return handleServerError(res, 'Erreur lors de la récupération de l’utilisateur', error);
  }
};

export const mettreAjourUtilisateur = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nom, email, role, password, specialiteId } = req.body; // Ajout de specialiteId

  try {
    const dataToUpdate = {
      nom,
      email,
      role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN',
      specialiteId, // Ajout de specialiteId dans les données de mise à jour
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const utilisateurExist = await prisma.utilisateurs.findUnique({
      where: { id },
    });

    if (!utilisateurExist) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const emailExistant = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (emailExistant && emailExistant.id !== id) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const utilisateurMisAJour = await prisma.utilisateurs.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json({
      message: 'Utilisateur mis à jour avec succès',
      utilisateur: utilisateurMisAJour,
    });
  } catch (error) {
    return handleServerError(res, 'Erreur lors de la mise à jour de l’utilisateur', error);
  }
};

export const supprimerUtilisateur = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await prisma.utilisateurs.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    return handleServerError(res, 'Erreur lors de la suppression de l’utilisateur', error);
  }
};
