// Importations de modules et configurations existants
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import login from './src/api/login.js'
import utilisateurRoutes from './src/routes/utilisateurRoutes.js'
import patientRoutes from './src/routes/patientRoutes.js'
import specialiteRoutes from './src/routes/specialiteRoutes.js'
import rendezVousRoutes from './src/routes/rendezVousRoutes.js'
import password from './src/api/password.js' // Importez votre route de mot de passe
import {
  authMiddleware,
  adminMiddleware
} from './src/middlewares/authentification.js'

dotenv.config()

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.use('/api/login', login)
app.use('/api', utilisateurRoutes)
app.use('/api', patientRoutes)
app.use('/api', specialiteRoutes)
app.use('/api', rendezVousRoutes)
app.use('/api/password', password) // Ajoutez cette ligne pour intégrer les routes de mot de passe

// Application des middlewares d'authentification et d'administration
app.use('/api/admin', authMiddleware, adminMiddleware, utilisateurRoutes)

// Gestion des erreurs
app.use((err, req, res, next) => {
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
