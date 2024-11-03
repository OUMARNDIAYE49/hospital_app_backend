import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors' // Importer CORS
import login from './src/api/login.js'
import utilisateurRoutes from './src/routes/utilisateurRoutes.js'
import patientRoutes from './src/routes/patientRoutes.js'
import specialiteRoutes from './src/routes/specialiteRoutes.js' // Importer les routes pour les spécialités
import rendezVousRoutes from './src/routes/rendezVousRoutes.js' // Importer les routes pour les rendez-vous
import {
  authMiddleware,
  adminMiddleware
} from './src/middlewares/authentification.js'

dotenv.config() // Charger les variables d'environnement

const app = express()

const corsOptions = {
  origin: 'http://localhost:5174',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
// Middleware pour parser les requêtes JSON
app.use(express.json())
app.use(bodyParser.json())

// Routes
app.use('/api/login', login) // Route pour le login
app.use('/api', utilisateurRoutes) // Routes pour les utilisateurs
app.use('/api', patientRoutes) // Routes pour les patients
app.use('/api', specialiteRoutes) // Routes pour les spécialités
app.use('/api', rendezVousRoutes) // Routes pour les rendez-vous

// Application du middleware d'authentification et d'administration sur les routes qui en ont besoin
app.use('/api/admin', authMiddleware, adminMiddleware, utilisateurRoutes) // Routes réservées aux admins

// Gestion des erreurs
app.use((err, req, res) => {
  // Retiré `next` car il n'est pas utilisé
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur interne est survenue'
  })
})

// Démarrer le serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})

export default app
