import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const handleServerError = (res, message, error) => {
  console.error(error);
  return res.status(500).json({ message });
};

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password, specialite_id } = req.body; // Ajout de specialiteId
    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateurExistant = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Vérification que specialite_Id est présent pour le rôle MEDECIN
    if (role === 'MEDECIN' && !specialite_id) {
      return res.status(400).json({ message: 'La spécialité est obligatoire pour un médecin' });
    }

    // Vérifier si la spécialité existe
    if (role === 'MEDECIN') {
      const specialiteExistante = await prisma.specialites.findUnique({
        where: { id: specialite_id },
      });
      if (!specialiteExistante) {
        return res.status(404).json({ message: 'La spécialité spécifiée n\'existe pas' });
      }
    }

    const nouvelUtilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        email,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN',
        password: hashedPassword,
        specialite: role === 'MEDECIN' ? { connect: { id: specialite_id } } : undefined,
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
  const { nom, email, role, password, specialite_id } = req.body; // Ajout de specialiteId

  try {
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

    // Vérification si specialite_Id est fourni pour le rôle MEDECIN
    if (role === 'MEDECIN' && !specialite_id) {
      return res.status(400).json({ message: 'La spécialité est obligatoire pour un médecin' });
    }

    // Vérifier si la spécialité existe lors de la mise à jour
    if (role === 'MEDECIN') {
      const specialiteExistante = await prisma.specialites.findUnique({
        where: { id: specialite_id },
      });
      if (!specialiteExistante) {
        return res.status(404).json({ message: 'La spécialité spécifiée n\'existe pas' });
      }
    }

    const dataToUpdate = {
      nom,
      email,
      role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN',
      specialite: role === 'MEDECIN' ? { connect: { id: specialite_id } } : undefined, // Connecter la spécialité si MEDECIN
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
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
