# Multi-Cloud Replication

## Description

Ce projet m'a été donné par mon enseignant dans le cadre de mon Master 2. Il s'agit de simuler une architecture multi-cloud en répliquant une base de données PostgreSQL sur trois environnements cloud différents : AWS, GCP et Azure.

Ce que j'ai compris en réalisant ce projet : les données peuvent être enregistrées sur plusieurs serveurs sans tenir compte de leur taille ni de leur type. On peut facilement les répliquer pour avoir plusieurs copies, ce qui est très utile au cas où l'un des serveurs tombe en panne — les autres prennent le relais automatiquement.

La stratégie choisie est Master-Slave :
- AWS joue le rôle du serveur principal (Master) où toutes les écritures se font en premier
- GCP et Azure sont les réplicas qui reçoivent automatiquement une copie des données

## Architecture

API Node.js :3000
       |
  AWS :5433  (Master - serveur principal)
       |
  GCP :5434      Azure :5435  (Réplicas - copies de sauvegarde)


## Technologies utilisées

- Node.js + Express : pour créer l'API REST
- PostgreSQL : la base de données répliquée
- Docker : pour simuler les 3 environnements cloud sur une seule machine
- GitHub Actions : pour le pipeline CI/CD
- Jest : pour les tests automatisés

## Prérequis

- Node.js v18+
- Docker Desktop
- Git

## Installation et démarrage

### 1. Cloner le projet

git clone https://github.com/Larissatombo/multi-cloud-replication.git
cd multi-cloud-replication


### 2. Configurer les variables d'environnement

cp .env.example .env

### 3. Lancer les bases de données


cd docker
docker compose up -d cloud-aws cloud-gcp cloud-azure

### 4. Installer les dépendances

cd 
npm install

### 5. Démarrer l'API

npm start

L'API est accessible sur : http://localhost:3000

## Endpoints de l'API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | / | Page d'accueil |
| GET | /health | État de l'API |
| POST | /users | Créer un utilisateur |
| GET | /users/aws | Lire depuis AWS |
| GET | /users/gcp | Lire depuis GCP |
| GET | /users/azure | Lire depuis Azure |
| GET | /consistency | Vérifier la cohérence entre les 3 clouds |

### Exemple de test de réplication

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nom": "Marie Curie", "email": "marie@example.com"}'

Après cette commande, l'utilisateur est automatiquement copié sur GCP et Azure.

## Lancer les tests

npm test

## Collection Postman

Importer le fichier `postman/collection.json` dans Postman pour tester tous les endpoints.

## Commandes Docker utiles

docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml down
docker logs cloud-aws
docker exec -it cloud-aws psql -U postgres -d cloud_aws

## Structure du projet

multi-cloud-replication/
├── src/
│   ├── app.js
│   ├── replication.js
│   └── db.js
├── docker/
│   ├── docker-compose.yml
│   └── init.sql
├── tests/
│   └── api.test.js
├── postman/
│   └── collection.json
├── .github/workflows/
│   └── pipeline.yml
├── docs/
│   ├── architecture.md
│   ├── guide-utilisateur.md
│   └── maintenance-rollback.md
├── Dockerfile
├── .env.example
├── package.json
└── README.md