# Guide Utilisateur & Maintenance

## Guide Utilisateur

### Comment démarrer le projet ?

1. Ouvrir un terminal dans le dossier du projet
2. Lancer les bases de données : `docker-compose -f docker/docker-compose.yml up -d`
3. Lancer l'API : `npm start`
4. Ouvrir un navigateur sur `http://localhost:3000`

### Comment créer un utilisateur ?

Via Postman ou curl :

POST http://localhost:3000/users
Body: { "nom": "Prénom Nom", "email": "email@example.com" }

L'utilisateur sera automatiquement créé sur AWS, GCP et Azure.

### Comment vérifier que la réplication fonctionne ?

1. Créer un utilisateur via `POST /users`
2. Comparer les données :
   - `GET /users/aws` → données sur AWS
   - `GET /users/gcp` → données sur GCP
   - `GET /users/azure` → données sur Azure
3. Vérifier la cohérence : `GET /consistency`


## Procédures de Maintenance

### Vérifier l'état des conteneurs

docker ps


### Redémarrer un cloud spécifique

docker restart cloud-aws   


### Voir les logs d'erreur

docker logs cloud-aws --tail 50


### Sauvegarder la base AWS (export SQL)

docker exec cloud-aws pg_dump -U postgres cloud_aws > backup_aws.sql


## Procédure de Rollback

En cas de problème grave :

### Rollback complet (tout réinitialiser)

# 1. Arrêter tous les conteneurs
docker-compose -f docker/docker-compose.yml down

# 2. Supprimer les volumes (suppression de tout les données)
docker-compose -f docker/docker-compose.yml down -v

# 3. Relancer tout proprement
docker-compose -f docker/docker-compose.yml up -d

### Rollback du code (revenir à la version précédente)

# Voir l'historique des versions
git log --oneline

# Revenir à une version précédente
git checkout <hash-du-commit>

# Relancer l'API
npm start

### Restaurer une base depuis un backup

docker exec -i cloud-aws psql -U postgres cloud_aws < backup_aws.sql

