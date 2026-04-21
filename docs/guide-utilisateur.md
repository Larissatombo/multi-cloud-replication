# Guide Utilisateur — Multi-Cloud Replication

## 1. Introduction

Ce guide explique comment utiliser le système de réplication multi-cloud.
L'application permet de créer des données sur un serveur principal (AWS) et de les répliquer automatiquement sur deux autres serveurs (GCP et Azure).

## 2. Démarrage du système

### Étape 1 — Lancer les bases de données

Ouvrir un terminal et se placer dans le dossier docker :

cd docker
docker compose up -d cloud-aws cloud-gcp cloud-azure

Vérifier que les 3 conteneurs sont bien démarrés :

docker ps

On devrait voir : cloud-aws, cloud-gcp, cloud-azure avec le statut "Up".

### Étape 2 — Lancer l'API

Ouvrir un nouveau terminal et se placer à la racine du projet :

npm start

L'API est prête quand vous voyez :

Connexion AWS établie avec succès
Connexion GCP établie avec succès
Connexion Azure établie avec succès
API prête à recevoir des requêtes


## 3. Utilisation de l'API

### Vérifier que l'API fonctionne

curl http://localhost:3000/health


Réponse attendue :
  json
{ "status": "OK" }

### Créer un utilisateur (avec réplication automatique)

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nom": "Marie Curie", "email": "marie@example.com"}'


Réponse attendue :
   json
{
  "message": "Utilisateur créé et répliqué avec succès",
  "data": {
    "master": { "id": 1, "nom": "Marie Curie", "email": "marie@example.com" },
    "replication": [
      { "cloud": "GCP", "status": "success" },
      { "cloud": "Azure", "status": "success" }
    ]
  }
}


### Lire les données depuis un cloud

curl http://localhost:3000/users/aws
curl http://localhost:3000/users/gcp
curl http://localhost:3000/users/azure


### Vérifier la cohérence entre les 3 clouds

curl http://localhost:3000/consistency


Réponse attendue :
   json
{
  "message": "Les 3 clouds sont synchronisés",
  "data": { "aws": 1, "gcp": 1, "azure": 1, "consistent": true }
}


## 4. Utilisation avec Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner le fichier `postman/collection.json`
4. La collection **Multi-Cloud Replication API** apparaît avec 8 requêtes prêtes à l'emploi
5. Cliquer sur chaque requête et appuyer sur **Send**


## 5. Lancer les tests automatisés

npm test

Résultat attendu : **6 tests passent avec succès**


## 6. Arrêter le système

Pour arrêter l'API : appuyer sur **Ctrl+C** dans le terminal

Pour arrêter les bases de données :

docker compose -f docker/docker-compose.yml down


## 7. Résolution des problèmes courants

| Problème | Solution |
|---|---|
| Erreur "Cannot connect to database" | Vérifier que Docker est démarré et relancer `docker compose up -d` |
| Erreur "Port 3000 already in use" | Taper `kill $(lsof -t -i:3000)` puis relancer `npm start` |
| Erreur "relation does not exist" | Créer la table manuellement avec le script init.sql |
| Les clouds ne sont pas synchronisés | Vérifier les logs avec `docker logs cloud-aws` |
