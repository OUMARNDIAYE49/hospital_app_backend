import prisma from '../config/database.js'
import { Prisma } from '@prisma/client'

// Fonction pour créer un patient
const createPatient = async (req, res) => {
  const {
    nom,
    telephone,
    email,
    date_naissance, // Utilisation de date_naissance
    adresse,
   
  } = req.body

  try {
    // const admin = await prisma.utilisateurs.findUnique({
    //   where: { id: admin_id }
    // })

    // if (!admin) {
    //   return res
    //     .status(404)
    //     .json({ message: "L'administrateur spécifié n'existe pas." })
    // }

    const newPatient = await prisma.patients.create({
      data: {
        nom,
        telephone,
        email,
        date_naissance: new Date(date_naissance), // Utilisation de date_naissance
        adresse,
        // admin: { connect: { id: admin_id } } // Utilisation de admin_id
      }
    })

    return res.status(201).json({
      message: 'Patient créé avec succès',
      patient: newPatient
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const field = error.meta.target
      return res
        .status(400)
        .json({
          message: `Le ${field} est déjà utilisé, veuillez en choisir un autre.`
        })
    }
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la création du patient' })
  }
}

// Fonction pour mettre à jour un patient
const updatePatient = async (req, res) => {
  const { id } = req.params
  const { nom, telephone, email, date_naissance, adresse } = req.body

  try {
    const updatedPatient = await prisma.patients.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        telephone,
        email,
        date_naissance: new Date(date_naissance), // Utilisation de date_naissance
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
