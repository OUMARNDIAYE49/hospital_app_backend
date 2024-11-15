import prisma from '../config/database.js'
import { Prisma } from '@prisma/client'

const createPatient = async (req, res) => {
  const { nom, telephone, email, date_naissance, adresse } = req.body;
  const utilisateurId = req.utilisateur?.admin_id; // L'ID de l'utilisateur authentifié

  if (!utilisateurId) {
    return res.status(400).json({ message: 'Utilisateur non authentifié.' });
  }

  try {
    const newPatient = await prisma.patients.create({
      data: {
        nom,
        telephone,
        email,
        date_naissance: new Date(date_naissance),
        adresse,
        utilisateurId,  // Enregistrez l'ID de l'utilisateur qui a créé le patient
      },
    });

    return res.status(201).json({
      message: 'Patient créé avec succès',
      patient: newPatient,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const field = error.meta.target;
      return res.status(400).json({
        message: `Le ${field} est déjà utilisé, veuillez en choisir un autre.`,
      });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la création du patient' });
  }
};

// Fonction pour mettre à jour un patient
const updatePatient = async (req, res) => {
  const { id } = req.params
  const { nom, telephone, email, date_naissance, adresse } = req.body

  try {
    // Vérifier si un autre patient a déjà cet email
    const existingPatient = await prisma.patients.findUnique({
      where: { email }
    })

    if (existingPatient && existingPatient.id !== parseInt(id)) {
      return res.status(400).json({
        message:
          'Cet email est déjà utilisé par un autre patient. Veuillez en choisir un autre.'
      })
    }

    // Effectuer la mise à jour si l'email est unique
    const updatedPatient = await prisma.patients.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        telephone,
        email,
        date_naissance: new Date(date_naissance),
        adresse
      }
    })

    return res.status(200).json({
      message: 'Patient mis à jour avec succès',
      patient: updatedPatient
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Patient non trouvé' })
    }
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour du patient' })
  }
}

// Fonction pour supprimer un patient
const deletePatient = async (req, res) => {
  const { id } = req.params

  try {
    const patient = await prisma.patients.findUnique({
      where: { id: parseInt(id) }
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' })
    }

    await prisma.patients.delete({
      where: { id: parseInt(id) }
    })

    return res.status(200).json({ message: 'Patient supprimé avec succès' })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(400).json({
        message:
          "Impossible de supprimer ce patient car il est associé à d'autres enregistrements."
      })
    }
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la suppression du patient' })
  }
}

// Fonction pour obtenir un patient par ID
const getPatientById = async (req, res) => {
  const { id } = req.params

  try {
    const patient = await prisma.patients.findUnique({
      where: { id: parseInt(id) }
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' })
    }

    return res.status(200).json(patient)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération du patient' })
  }
}

// Fonction pour obtenir la liste de tous les patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patients.findMany()
    return res.status(200).json(patients)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des patients' })
  }
}

// Exporter les fonctions comme un objet par défaut
export default {
  createPatient,
  updatePatient,
  deletePatient,
  getPatientById,
  getAllPatients
}
