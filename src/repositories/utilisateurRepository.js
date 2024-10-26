// repositories/utilisateurRepository.js
import prisma from '../config/database.js'

// Créer un utilisateur
export const createUtilisateur = async (data) => {
  return prisma.utilisateur.create({
    data
  })
}

// Mettre à jour un utilisateur par son ID
export const updateUtilisateur = async (id, data) => {
  return prisma.utilisateur.update({
    where: { id: Number(id) },
    data
  })
}

// Supprimer un utilisateur par son ID
export const deleteUtilisateur = async (id) => {
  return prisma.utilisateur.delete({
    where: { id: Number(id) }
  })
}

// Récupérer un utilisateur par son ID
export const getUtilisateurById = async (id) => {
  return prisma.utilisateur.findUnique({
    where: { id: Number(id) }
  })
}

// Récupérer tous les utilisateurs
export const getAllUtilisateurs = async () => {
  return prisma.utilisateur.findMany()
}
