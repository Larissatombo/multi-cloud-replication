# 🌐 Multi-Cloud Replication

> Projet M2 — Réplication de base de données entre plusieurs clouds simulés  
> Auteure : Etudiante M2 — École Supérieure Polytechnique d'Antsiranana

---

## 📌 Description

Ce projet simule une architecture **multi-cloud** en répliquant une base de données PostgreSQL sur trois environnements cloud distincts (AWS, GCP, Azure), le tout conteneurisé avec **Docker** et exposé via une **API REST Node.js**.

**Stratégie de réplication :** Master-Slave  
- 🟢 **AWS** → Nœud Master (source de vérité)  
- 🔵 **GCP** → Réplica 1  
- 🟣 **Azure** → Réplica 2  

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                API Node.js :3000                │
└──────────┬─────────────────────────────────────┘
           │ Écriture + Lecture
    ┌──────▼──────┐
    │  AWS :5433  │  ← Master
    │ (PostgreSQL)│
    └──────┬──────┘
           │ Réplication
    ┌──────▼──────┐    ┌──────────────┐
    │  GCP :5434  │    │ Azure :5435  │  ← Réplicas
    │ (PostgreSQL)│    │ (PostgreSQL) │
    └─────────────┘    └──────────────┘
```

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

---

## 🚀 Installation et démarrage

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/multi-cloud-replication.git
cd multi-cloud-replication
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
# Les valeurs par défaut fonctionnent avec Docker
```

### 3. Lancer les bases de données (3 clouds simulés)

```bash
cd docker
docker-compose up -d
```

Vérifier que les 3 conteneurs tournent :

```bash
docker ps
```

Vous devez voir : `cloud-aws`, `cloud-gcp`, `cloud-azure`

### 4. Installer les dépendances Node.js

```bash
cd ..
npm install
```

### 5. Démarrer l'API

```bash
npm start
```

L'API est accessible sur : **http://localhost:3000**

---

## 📡 Endpoints de l'API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Page d'accueil et liste des endpoints |
| GET | `/health` | Vérifier l'état de l'API |
| POST | `/users` | Créer un utilisateur (+ réplication auto) |
| GET | `/users/aws` | Lire les données depuis AWS |
| GET | `/users/gcp` | Lire les données depuis GCP |
| GET | `/users/azure` | Lire les données depuis Azure |
| GET | `/consistency` | Vérifier la cohérence entre les 3 clouds |

### Exemple : Créer un utilisateur

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nom": "Marie Curie", "email": "marie@example.com"}'
```

---

## 🧪 Lancer les tests

```bash
npm test
```

---

## 📮 Collection Postman

Importer le fichier `postman/collection.json` dans Postman pour tester tous les endpoints.

---

## 🔧 Commandes Docker utiles

```bash
# Démarrer tous les conteneurs
docker-compose -f docker/docker-compose.yml up -d

# Arrêter tous les conteneurs
docker-compose -f docker/docker-compose.yml down

# Voir les logs d'un conteneur
docker logs cloud-aws

# Accéder à la base AWS directement
docker exec -it cloud-aws psql -U postgres -d cloud_aws
```

---

## 📁 Structure du projet

```
multi-cloud-replication/
├── src/
│   ├── app.js            # API principale
│   ├── replication.js    # Logique de réplication
│   └── db.js             # Connexions aux bases
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
```