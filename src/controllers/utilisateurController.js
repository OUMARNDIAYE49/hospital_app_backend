import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

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

    const nouvelUtilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        email,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN', // Gestion des rôles ADMIN et MEDECIN
        password: hashedPassword
      }
    })

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: nouvelUtilisateur
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la création de l’utilisateur' })
  }
}

export const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany()
    return res.status(200).json(utilisateurs)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des utilisateurs' })
  }
}

export const afficherUtilisateurParId = async (req, res) => {
  const { id } = req.params
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id: parseInt(id) }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    return res.status(200).json(utilisateur)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération de l’utilisateur' })
  }
}

export const mettreAjourUtilisateur = async (req, res) => {
  const { id } = req.params
  const { nom, email, role, password } = req.body

  try {
    const dataToUpdate = {
      nom,
      email,
      role: role === 'ADMIN' ? 'ADMIN' : 'MEDECIN' // Gestion des rôles lors de la mise à jour
    }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    const utilisateurExist = await prisma.utilisateurs.findUnique({
      where: { id: parseInt(id) }
    })

    if (!utilisateurExist) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    const emailExistant = await prisma.utilisateurs.findUnique({
      where: { email }
    })

    if (emailExistant && emailExistant.id !== parseInt(id)) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    const utilisateurMisAJour = await prisma.utilisateurs.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    })

    return res.status(200).json({
      message: 'Utilisateur mis à jour avec succès',
      utilisateur: utilisateurMisAJour
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour de l’utilisateur' })
  }
}

export const supprimerUtilisateur = async (req, res) => {
  const { id } = req.params
  try {
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id: parseInt(id) }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    await prisma.utilisateurs.delete({
      where: { id: parseInt(id) }
    })

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Erreur lors de la suppression de l’utilisateur' })
  }
}
