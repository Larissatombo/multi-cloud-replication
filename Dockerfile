# ============================================================
# Dockerfile - Image de l'API Node.js
# Auteur : Etudiante M2 - ESP Antsiranana
# ============================================================

# Image de base Node.js version LTS
FROM node:18-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances en premier (optimisation cache)
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tout le code source
COPY src/ ./src/
COPY .env.example .env

# Exposer le port de l'API
EXPOSE 3000

# Commande de démarrage
CMD ["node", "src/app.js"]
