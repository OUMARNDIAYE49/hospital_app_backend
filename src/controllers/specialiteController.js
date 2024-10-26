import prisma from '../config/database.js'
import { Prisma } from '@prisma/client'

const specialiteController = {
  // Fonction pour créer une spécialité
  createSpecialite: async (req, res) => {
    const { nom } = req.body

    try {
      const newSpecialite = await prisma.specialites.create({
        data: { nom }
      })

      return res.status(201).json({
        message: 'Spécialité créée avec succès',
        specialite: newSpecialite
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res
          .status(400)
          .json({ message: `La spécialité "${nom}" existe déjà.` })
      }
      console.error(error)
      return res
        .status(500)
        .json({ message: 'Erreur lors de la création de la spécialité', error })
    }
  },

  // Fonction pour obtenir une spécialité par ID
  getSpecialiteById: async (req, res) => {
    const { id } = req.params

    try {
      const specialite = await prisma.specialites.findUnique({
        where: { id: Number(id) }
      })

      if (!specialite) {
        return res.status(404).json({ message: 'Spécialité non trouvée' })
      }

      return res.status(200).json(specialite)
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({
          message: 'Erreur lors de la récupération de la spécialité',
          error
        })
    }
  },

  // Fonction pour obtenir la liste de toutes les spécialités
  getSpecialites: async (req, res) => {
    try {
      const specialites = await prisma.specialites.findMany()
      return res.status(200).json(specialites)
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({
          message: 'Erreur lors de la récupération des spécialités',
          error
        })
    }
  },

  // Fonction pour mettre à jour une spécialité
  updateSpecialite: async (req, res) => {
    const { id } = req.params
    const { nom } = req.body

    try {
      // Vérification si la spécialité existe
      const existingSpecialite = await prisma.specialites.findUnique({
        where: { id: Number(id) }
      })

      if (!existingSpecialite) {
        return res.status(404).json({ message: 'Spécialité non trouvée' })
      }

      // Vérification de l'unicité du nom
      const duplicateSpecialite = await prisma.specialites.findFirst({
        where: { nom, NOT: { id: Number(id) } }
      })

      if (duplicateSpecialite) {
        return res
          .status(400)
          .json({ message: `La spécialité "${nom}" existe déjà.` })
      }

      const updatedSpecialite = await prisma.specialites.update({
        where: { id: Number(id) },
        data: { nom }
      })

      return res.status(200).json({
        message: 'Spécialité mise à jour avec succès',
        specialite: updatedSpecialite
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res
          .status(400)
          .json({ message: `La spécialité "${nom}" existe déjà.` })
      }
      console.error(error)
      return res
        .status(500)
        .json({
          message: 'Erreur lors de la mise à jour de la spécialité',
          error
        })
    }
  },

  // Fonction pour supprimer une spécialité
  deleteSpecialite: async (req, res) => {
    const { id } = req.params

    try {
      const specialite = await prisma.specialites.findUnique({
        where: { id: Number(id) }
      })

      if (!specialite) {
        return res.status(404).json({ message: 'Spécialité non trouvée' })
      }

      await prisma.specialites.delete({
        where: { id: Number(id) }
      })

      return res
        .status(200)
        .json({ message: 'Spécialité supprimée avec succès' })
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({
          message: 'Erreur lors de la suppression de la spécialité',
          error
        })
    }
  }
}

export default specialiteController
