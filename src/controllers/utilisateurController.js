import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { updateCurrentUser, changePassword } from '../services/useService.js';

const prisma = new PrismaClient();

const handleServerError = (res, message, error) => {
  console.error(error);
  return res.status(500).json({ message });
};

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateurExistant = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    let specialite_id = null;
    if (role === 'MEDECIN') {
      specialite_id = req.body.specialite_id;
      if (!specialite_id) {
        return res.status(400).json({ message: 'La spécialité est obligatoire pour un médecin' });
      }

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
        role,
        password: hashedPassword,
        specialite: specialite_id ? { connect: { id: specialite_id } } : undefined,
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
  const { nom, email, role, password } = req.body;

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

    let specialite_id = null;
    if (role === 'MEDECIN') {
      specialite_id = req.body.specialite_id;
      if (!specialite_id) {
        return res.status(400).json({ message: 'La spécialité est obligatoire pour un médecin' });
      }

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
      role,
      specialite: role === 'ADMIN' ? { disconnect: true } : { connect: { id: specialite_id } },
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
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Impossible de supprimer cet utilisateur car il est lié à d’autres enregistrements.',
      });
    }
    return handleServerError(res, 'Erreur lors de la suppression de l’utilisateur', error);
  }
};

export async function updateCurentUser(req, res, next) {
  const userId = req.utilisateur.utilisateurId;
  const { nom, email } = req.body; 
  try {
    const user = await updateCurrentUser(userId, { nom, email });
    res.status(200).json({ message: 'Informations mises à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des informations', error: error.message });
  }
  next();
}

export async function modifyPassword(req, res) {
  const userId = req.utilisateur.utilisateurId;
  console.log("Corps de la requête :", req.body);
  const { oldPassword, newPassword } = req.body;  

  try {
    const response = await changePassword(userId, oldPassword, newPassword); 
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
