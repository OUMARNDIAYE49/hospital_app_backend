# Backend - Gestion des Rendez-vous des hopitaux.

## Introduction

Ce projet représente le **Backend** de l'application de Gestion des Rendez-vous des hopitaux. L'API permet de gérer les données des spécialités médicales, des utilisateurs, des patients, et des rendez-vous. Elle est construite avec **Express**


### Prérequis

Avant de commencer, vous devez avoir les éléments suivants installés :

- Node.js (version 14.x ou supérieure)
- PostgreSQL
- Prisma
- Express.js (version 4.21 ou supérieure)

### Installation

1. Clonez le dépôt :

   `git clone https://github.com/OUMARNDIAYE49/hospital_app_backend.git`

2. Accédez au répertoire du projet :
   `hospital-app-backend`

Installez les dépendances :

`npm install`


### Configurer la base de données

- Assurez-vous que PostgreSQL est en cours d'exécution sur votre machine locale.
- Mettez les paramètres de connexion dans schema.prisma.
- Créez un fichier .env avec la configuration de votre base de données : 

```bash
DATABASE_URL="postgresql://postgres:mot-de-passe@localhost:5432/hospital_app"

PORT = 3000
```
### Utilisation

Pour démarrer l'application en mode développement, utilisez la commande suivante :

`npm start`

- Importer la collection les collections dans postman pour effectuer des tests:
 - `utilisateurs.postman_collection.json`
 - `patients.postman_collection.json`
 - ` specialites.postman_collection.json`
 - `rendezVous.postman_collection.json`


### Endpoints API

**Créer une nouveau utilisateur**

- URL : http://localhost:3000/api/utilisateurs
- Méthode : POST
- Réponse: 
```bash
 [
 {
    "message": "Utilisateur créé avec succès",
    "utilisateur": {
        "id": 82,
        "nom": "Hama ",
        "email": "hama@gmail.com",
        "password": "$2b$10$PCgX5aHLbSsK7MuflD3BLe8JN.x1r0tQBvoWZmE8yB2k3dleq1J42",
        "role": "MEDECIN",
        "specialite_id": 1
    }
}
 ]
```

**Récupérer toutes les utilisateurs**

- URL : http://localhost:3000/api/utilisateurs
- Méthode : GET
- Réponse: 

```bash
[
    {
        "id": 1,
        "nom": "Houssein",
        "email": "h@example.com",
        "password": "$2b$10$GpjLe8iK3WfS8uOD8G7LoOU.855E9nI6mYg97TS0uoxYBsnkHj1XK",
        "role": "MEDECIN",
        "specialite_id": 1
    },
    {
        "id": 78,
        "nom": "Mamoudou",
        "email": "b@gmail.com",
        "password": "$2b$10$zVkbMWx2yiQN8s8F3MaTAuZA3GLWOl1n/xk9R/7Cwedx3ozRrQbnK",
        "role": "ADMIN",
        "specialite_id": null
    },
    {
        "id": 81,
        "nom": "Demba ",
        "email": "demb@gmail.com",
        "password": "$2b$10$N1r4sP6ow3xTXzaa9Buu1OXvPz1BjaqP2dq5Z2/xinMEi.kC2TvCO",
        "role": "ADMIN",
        "specialite_id": null
    },
    {
        "id": 34,
        "nom": "Amadou Tall",
        "email": "amado@gmail.com",
        "password": "$2b$10$cr3.ld1Sj9CboubilcfcYO0dzOtYyn292Vp6yCtlZTWpr.ulh8cmS",
        "role": "MEDECIN",
        "specialite_id": 33
    }
]
```

**Récupérer un utilisateur**

- URL : http://localhost:3000/api/utilisateurs/1
- Méthode : GET
- Réponse: 

```bash
[
  
     {
        "id": 1,
        "nom": "Houssein",
        "email": "h@example.com",
        "password": "$2b$10$GpjLe8iK3WfS8uOD8G7LoOU.855E9nI6mYg97TS0uoxYBsnkHj1XK",
        "role": "MEDECIN",
        "specialite_id": 1
    },
  
]
```

**Mettre à jour une  information d'un utilisateur**

- URL : http://localhost:3000/api/utilisateurs/76
- Méthode : PUT

```bash
{
    "message": "Utilisateur mis à jour avec succès",
    "utilisateur": {
        "id": 76,
        "nom": "Amadou Soaw",
        "email": "amad@gmail.com",
        "password": "$2b$10$h.HF1Uic.5RZ8KOeTzZiZe2/ZI07SB89F7KaC0PBTO5KNABUP2Bpu",
        "role": "ADMIN",
        "specialite_id": null
    }
}
```

 **Supprimer un utilisateur**

- URL :http://localhost:3000/api/utilisateurs/82
- Méthode : DELETE
- Réponse: 
  ```bash
  {
    "message": "Utilisateur supprimé avec succès."
  }
```


## Authers

[Oumar Djiby Ndiaye](https://github.com/OUMARNDIAYE49/hospital-appointment-system.gi)
