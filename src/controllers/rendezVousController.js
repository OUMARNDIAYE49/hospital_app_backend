import prisma from '../config/database.js';

// Contrôleur de gestion des rendez-vous
const rendezVousController = {
  // Créer un rendez-vous (ADMIN uniquement)
  createRendezVous: async (req, res) => {
    const { date_debut, date_fin, status, patient_id, medecin_id } = req.body;

    try {
      // Vérifier si le patient et le médecin existent
      const patient = await prisma.patients.findUnique({
        where: { id: patient_id }
      });
      const medecin = await prisma.utilisateurs.findUnique({
        where: { id: medecin_id }
      });

      if (!patient || !medecin) {
        return res.status(404).json({
          message: `Un des identifiants fournis est incorrect : ${!patient ? 'Patient ' : ''}${!medecin ? 'Médecin ' : ''}non trouvé.`
        });
      }

      // Créer le rendez-vous
      const newRendezVous = await prisma.rendezVous.create({
        data: {
          date_debut: new Date(date_debut),
          date_fin: new Date(date_fin),
          status,
          patient: { connect: { id: patient_id } },
          medecin: { connect: { id: medecin_id } }
        }
      });

      return res.status(201).json({
        message: 'Rendez-vous créé avec succès',
        rendezvous: newRendezVous
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la création du rendez-vous',
        error: error.message
      });
    }
  },

  // Mettre à jour un rendez-vous (ADMIN uniquement)
  updateRendezVous: async (req, res) => {
    const { id } = req.params;
    const { date_debut, date_fin, status, medecin_id, patient_id } = req.body;

    try {
      // Vérifier si le rendez-vous existe
      const existingRendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existingRendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      // Vérifier si le patient et le médecin existent
      const patient = patient_id ? await prisma.patients.findUnique({
        where: { id: patient_id }
      }) : null;

      const medecin = medecin_id ? await prisma.utilisateurs.findUnique({
        where: { id: medecin_id }
      }) : null;

      if (patient_id && !patient) {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }

      if (medecin_id && !medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }

      // Mettre à jour le rendez-vous
      const updatedRendezVous = await prisma.rendezVous.update({
        where: { id: parseInt(id) },
        data: {
          date_debut: date_debut ? new Date(date_debut) : existingRendezVous.date_debut,
          date_fin: date_fin ? new Date(date_fin) : existingRendezVous.date_fin,
          status: status || existingRendezVous.status,
          patient: patient_id ? { connect: { id: patient_id } } : undefined,
          medecin: medecin_id ? { connect: { id: medecin_id } } : undefined
        }
      });

      return res.status(200).json({
        message: 'Rendez-vous mis à jour avec succès',
        rendezvous: updatedRendezVous
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la mise à jour du rendez-vous',
        error: error.message
      });
    }
  },

  // Supprimer un rendez-vous (ADMIN uniquement)
  deleteRendezVous: async (req, res) => {
    const { id } = req.params;

    try {
      const existingRendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existingRendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      await prisma.rendezVous.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).json({ message: 'Rendez-vous supprimé' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la suppression du rendez-vous',
        error: error.message
      });
    }
  },

  // Obtenir un rendez-vous par ID (ADMIN ou MEDECIN)
  getRendezVousById: async (req, res) => {
    const { id } = req.params;

    try {
      const rendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) },
        include: {
          admin: true,
          patient: true,
          medecin: true
        }
      });
      if (!rendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      res.status(200).json(rendezVous);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la récupération du rendez-vous',
        error: error.message
      });
    }
  },

  // Liste de tous les rendez-vous (ADMIN ou MEDECIN)
  getAllRendezVous: async (req, res) => {
    try {
      const rendezVous = await prisma.rendezVous.findMany({
        include: {
          admin: true,
          patient: true,
          medecin: true
        }
      });
      res.status(200).json(rendezVous);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la récupération des rendez-vous',
        error: error.message
      });
    }
  }
};

export default rendezVousController;
