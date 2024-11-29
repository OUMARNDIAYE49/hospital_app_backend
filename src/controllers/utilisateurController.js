import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { updateCurrentUser } from '../services/useService.js'

const prisma = new PrismaClient()

const handleServerError = (res, message, error) => {
  console.error(error)
  return res.status(500).json({ message })
}

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const utilisateurExistant = await prisma.utilisateurs.findUnique({
      where: { email }
    })

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    let specialite_id = null
    if (role === 'MEDECIN') {
      specialite_id = req.body.specialite_id
      if (!specialite_id) {
        return res
          .status(400)
          .json({ message: 'La spécialité est obligatoire pour un médecin' })
      }

      const specialiteExistante = await prisma.specialites.findUnique({
        where: { id: specialite_id }
      })
      if (!specialiteExistante) {
        return res
          .status(404)
          .json({ message: "La spécialité spécifiée n'existe pas" })
      }
    }

    const nouvelUtilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        email,
        role,
        password: hashedPassword,
        specialite: specialite_id
          ? { connect: { id: specialite_id } }
          : undefined
      }
    })

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: nouvelUtilisateur
    })
  } catch (error) {
    return handleServerError(
      res,
      'Erreur lors de la création de l’utilisateur',
      error
    )
  }
}

export const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany()
    return res.status(200).json(utilisateurs)
  } catch (error) {
    return handleServerError(
      res,
      'Erreur lors de la récupération des utilisateurs',
      error
    )
  }
}

export const afficherUtilisateurParId = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    return res.status(200).json(utilisateur)
  } catch (error) {
    return handleServerError(
      res,
      'Erreur lors de la récupération de l’utilisateur',
      error
    )
  }
}
export const afficherMedecinDisponible = async (req, res) => {
  const { dateDebut, dateFin } = req.query // Correction de req.qery en req.query
  const date_debut = new Date(dateDebut).toISOString()
  const date_fin = new Date(dateFin).toISOString()
  try {
    const medecinsDisponibles = await prisma.utilisateurs.findMany({
      where: {
        role: 'MEDECIN',
        rendezVous_as_medecin: {
          none: {
            date_debut: {
              lte: date_debut
            },
            date_fin: {
              gte: date_fin
            }
          }
        }
      },
      include: {
        rendezVous_as_medecin: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })
    res.json(medecinsDisponibles)
  } catch (error) {
    res.status(500).json({
      error: 'Erreur lors de la récupération des médecins disponibles',
      error
    })
  }
}

export const afficherTelephonePatientsDisponibles = async (req, res) => {
  const { dateDebut, dateFin } = req.query;

  if (!dateDebut || !dateFin) {
    return res.status(400).json({ error: 'Les dates début et fin sont obligatoires' });
  }

  try {
    const patientsDisponibles = await prisma.patients.findMany({
      where: {
        rendezVous: {
          none: {
            OR: [
              {
                date_debut: { lte: new Date(dateFin).toISOString() },
                date_fin: { gte: new Date(dateDebut).toISOString() }
              }
            ]
          }
        }
      },
      select: {
        telephone: true
      }
    });

    res.json(patientsDisponibles.map(patient => patient.telephone));
  } catch (error) {
    res.status(500).json({
      error: 'Erreur lors de la récupération des téléphones des patients disponibles',
      details: error.message
    });
  }
};



export const mettreAjourUtilisateur = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Conversion de l'ID en nombre
  const { nom, email, role, specialite_id } = req.body; // Récupération des données

  try {
    // Vérifier si l'utilisateur existe
    const utilisateurExist = await prisma.utilisateurs.findUnique({
      where: { id },
    });

    if (!utilisateurExist) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const emailExistant = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (emailExistant && emailExistant.id !== id) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.' });
    }

    // Gérer la logique spécifique aux médecins
    if (role === 'MEDECIN') {
      if (!specialite_id) {
        return res.status(400).json({ message: 'La spécialité est obligatoire pour un médecin.' });
      }

      const specialiteExistante = await prisma.specialites.findUnique({
        where: { id: specialite_id },
      });

      if (!specialiteExistante) {
        return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
      }
    }

    // Préparer les données pour la mise à jour
    const dataToUpdate = {
      nom,
      email,
      role,
      specialite: role === 'ADMIN'
        ? { disconnect: true }
        : specialite_id
          ? { connect: { id: specialite_id } }
          : undefined,
    };

    // Mettre à jour l'utilisateur
    const utilisateurMisAJour = await prisma.utilisateurs.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, nom: true, email: true, role: true, specialite: true },
    });

    // Répondre avec succès
    return res.status(200).json({
      message: `Utilisateur avec l'ID ${id} mis à jour avec succès.`,
      utilisateur: utilisateurMisAJour,
    });
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de l’utilisateur.", error });
  }
};


export const supprimerUtilisateur = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    await prisma.utilisateurs.delete({
      where: { id }
    })

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' })
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({
        message:
          'Impossible de supprimer cet utilisateur car il est lié à d’autres enregistrements.'
      })
    }
    return handleServerError(
      res,
      'Erreur lors de la suppression de l’utilisateur',
      error
    )
  }
}

export async function updateCurentUser(req, res, next) {
  const userId = req.utilisateur.utilisateurId
  const { nom, email } = req.body
  try {
    const user = await updateCurrentUser(userId, { nom, email })
    res
      .status(200)
      .json({ message: 'Informations mises à jour avec succès', user })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour des informations',
      error: error.message
    })
  }
  next()
}

export const changePassword = async (req, res) => {
  const userId = req.utilisateur?.utilisateurId; 
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Veuillez fournir le mot de passe actuel et le nouveau mot de passe.",
    });
  }

  try {
    const user = await prisma.utilisateurs.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: "UserNotFound",
        message: "Utilisateur non trouvé.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "InvalidCurrentPassword",
        message: "Le mot de passe actuel est incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        error: "SamePasswordError",
        message: "Le nouveau mot de passe doit être différent de l'ancien.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.utilisateurs.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      message: "Mot de passe mis à jour avec succès.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);

    res.status(500).json({
      error: "InternalServerError",
      message: "Une erreur est survenue lors de la mise à jour du mot de passe.",
    });
  }
};