const { Pool } = require('pg');
require('dotenv').config();

const cloudAWS = new Pool({
  host: process.env.AWS_HOST || 'localhost',
  port: process.env.AWS_PORT || 5433,
  database: process.env.AWS_DB || 'cloud_aws',
  user: process.env.AWS_USER || 'postgres',
  password: process.env.AWS_PASSWORD || 'postgres',
});

const cloudGCP = new Pool({
  host: process.env.GCP_HOST || 'localhost',
  port: process.env.GCP_PORT || 5434,
  database: process.env.GCP_DB || 'cloud_gcp',
  user: process.env.GCP_USER || 'postgres',
  password: process.env.GCP_PASSWORD || 'postgres',
});

const cloudAzure = new Pool({
  host: process.env.AZURE_HOST || 'localhost',
  port: process.env.AZURE_PORT || 5435,
  database: process.env.AZURE_DB || 'cloud_azure',
  user: process.env.AZURE_USER || 'postgres',
  password: process.env.AZURE_PASSWORD || 'postgres',
});

async function testConnections() {
  const clouds = [
    { name: 'AWS', pool: cloudAWS },
    { name: 'GCP', pool: cloudGCP },
    { name: 'Azure', pool: cloudAzure },
  ];

  for (const cloud of clouds) {
    try {
      await cloud.pool.query('SELECT 1');
      console.log(`Connexion ${cloud.name} établie avec succès`);
    } catch (err) {
      console.error(`Erreur de connexion ${cloud.name} :`, err.message);
    }
  }
}

module.exports = { cloudAWS, cloudGCP, cloudAzure, testConnections };