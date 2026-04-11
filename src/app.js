// ============================================================
// app.js - API REST principale
// Expose les endpoints pour tester la réplication multi-cloud
// Auteur : Etudiante M2 - ESP Antsiranana
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnections } = require('./db');
const { insertUser, readFromCloud, checkConsistency } = require('./replication');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ============================================================
// ROUTES
// ============================================================

// --- Route de bienvenue / santé de l'API ---
app.get('/', (req, res) => {
  res.json({
    message: 'API Multi-Cloud Replication opérationnelle',
    version: '1.0.0',
    auteur: 'Etudiante M2 - ESP Antsiranana',
    endpoints: [
      'GET  /health           -> Vérifier l\'état de l\'API',
      'POST /users            -> Créer un utilisateur (+ réplication)',
      'GET  /users/:cloud     -> Lire les utilisateurs d\'un cloud',
      'GET  /consistency      -> Vérifier la cohérence entre les clouds',
    ],
  });
});

// --- Vérification de l'état de l'API ---
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Créer un utilisateur et le répliquer sur tous les clouds ---
app.post('/users', async (req, res) => {
  const { nom, email } = req.body;

  // Validation des champs
  if (!nom || !email) {
    return res.status(400).json({ error: 'Les champs "nom" et "email" sont requis' });
  }

  try {
    const result = await insertUser(nom, email);
    res.status(201).json({
      message: 'Utilisateur créé et répliqué avec succès',
      data: result,
    });
  } catch (err) {
    console.error('Erreur lors de la création :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Lire les utilisateurs depuis un cloud spécifique ---
// :cloud peut être "aws", "gcp" ou "azure"
app.get('/users/:cloud', async (req, res) => {
  const { cloud } = req.params;

  try {
    const users = await readFromCloud(cloud);
    res.json({
      cloud: cloud.toUpperCase(),
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('Erreur de lecture :', err.message);
    res.status(400).json({ error: err.message });
  }
});

// --- Vérifier la cohérence des données entre les 3 clouds ---
app.get('/consistency', async (req, res) => {
  try {
    const result = await checkConsistency();
    res.json({
      message: result.consistent
        ? '✅ Les 3 clouds sont synchronisés'
        : '⚠️ Les clouds ne sont pas synchronisés',
      data: result,
    });
  } catch (err) {
    console.error('Erreur de vérification :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================
app.listen(PORT, async () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log('🔌 Test des connexions aux bases de données...\n');
  await testConnections();
  console.log('\n📡 API prête à recevoir des requêtes\n');
});

module.exports = app; // exporté pour les tests Jest
