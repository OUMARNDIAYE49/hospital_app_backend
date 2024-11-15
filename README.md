# Backend - Gestion du Cabinet Médical

## Introduction

Ce projet représente le **Backend** de l'application de Gestion des Rendez-vous des hopitaux. L'API permet de gérer les données des spécialités médicales, des utilisateurs, des patients, et des rendez-vous. Elle est construite avec **Express**

## Fonctionnalités Principales

### 1. Gestion des Spécialités

- **POST /specialties** : Créer une nouvelle spécialité médicale.
- **GET /specialties** : Récupérer la liste de toutes les spécialités.
- **PUT /specialties/:id** : Modifier une spécialité existante.
- **DELETE /specialties/:id** : Supprimer une spécialité.

### 2. Gestion des Utilisateurs

- **POST /users** : Créer un nouvel utilisateur (médecin, secrétaire, etc.).
- **GET /users** : Récupérer la liste de tous les utilisateurs.
- **PUT /users/:id** : Modifier un utilisateur existant.
- **DELETE /users/:id** : Supprimer un utilisateur.

### 3. Gestion des Patients

- **POST /patients** : Ajouter un nouveau patient.
- **GET /patients** : Récupérer la liste de tous les patients.
- **GET /patients/:id** : Récupérer les informations d'un patient spécifique.
- **PUT /patients/:id** : Modifier les informations d'un patient.
- **DELETE /patients/:id** : Supprimer un patient.

### 4. Gestion des Rendez-vous

- **POST /appointments** : Créer un nouveau rendez-vous.
- **GET /appointments** : Récupérer la liste de tous les rendez-vous.
- **GET /appointments/:id** : Récupérer les détails d'un rendez-vous spécifique.
- **PUT /appointments/:id** : Modifier un rendez-vous existant.
- **DELETE /appointments/:id** : Annuler un rendez-vous.

## Technologies Utilisées

- **Node.js** : Environnement d'exécution pour JavaScript côté serveur.
- **Express.js** : Framework minimaliste pour créer l'API REST.
- **Postgress** : Base de données NoSQL pour le stockage des données.
- **Mongoose** : ORM pour interagir avec MongoDB.
- **JWT (JSON Web Tokens)** : Pour l'authentification des utilisateurs.
- **bcrypt.js** : Pour le hachage des mots de passe des utilisateurs.
- **dotenv** : Pour gérer les variables d'environnement.

## Prérequis

Avant de commencer, vous devez avoir les éléments suivants installés :

- **Node.js** (version 16 ou supérieure)
- [Postgres](https://www.postgres.com/)
- [Postman](https://www.postman.com/) (facultatif, pour tester l'API)

## Installation

1. Clonez le dépôt :

   `git clone https://github.com/OUMARNDIAYE49/hospital_app_backend.git`

2. Accédez au répertoire du projet :
   `hospital-app-backend`

Installez les dépendances :

`npm install`

Utilisation

Pour démarrer l'application en mode développement, utilisez la commande suivante :

`npm start`

## Authers

[Oumar Djiby Ndiaye](https://github.com/OUMARNDIAYE49/hospital-appointment-system.gi)
