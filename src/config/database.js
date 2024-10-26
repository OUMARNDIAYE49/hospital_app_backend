// config/database.js
import { PrismaClient } from '@prisma/client'

// Initialisation du client Prisma pour interagir avec la base de données
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // Assurez-vous que la variable d'environnement est correctement définie
    }
  }
})

export default prisma
