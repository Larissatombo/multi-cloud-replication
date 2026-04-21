const { cloudAWS, cloudGCP, cloudAzure } = require('./db');

async function insertUser(nom, email) {
  const result = await cloudAWS.query(
    'INSERT INTO utilisateurs (nom, email) VALUES ($1, $2) RETURNING *',
    [nom, email]
  );
  const newUser = result.rows[0];
  console.log(`Insertion sur AWS (master) :`, newUser);

  const replicationResults = await replicateToAll(
    'INSERT INTO utilisateurs (nom, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
    [nom, email]
  );

  return { master: newUser, replication: replicationResults };
}

async function replicateToAll(query, values) {
  const replicas = [
    { name: 'GCP', pool: cloudGCP },
    { name: 'Azure', pool: cloudAzure },
  ];

  const results = [];

  for (const replica of replicas) {
    try {
      await replica.pool.query(query, values);
      console.log(`Réplication vers ${replica.name} : OK`);
      results.push({ cloud: replica.name, status: 'success' });
    } catch (err) {
      console.error(`Réplication vers ${replica.name} échouée :`, err.message);
      results.push({ cloud: replica.name, status: 'failed', error: err.message });
    }
  }

  return results;
}

async function readFromCloud(cloudName) {
  const pools = {
    aws: cloudAWS,
    gcp: cloudGCP,
    azure: cloudAzure,
  };

  const pool = pools[cloudName.toLowerCase()];
  if (!pool) throw new Error(`Cloud inconnu : ${cloudName}`);

  const result = await pool.query('SELECT * FROM utilisateurs ORDER BY id ASC');
  return result.rows;
}

async function checkConsistency() {
  const [awsData, gcpData, azureData] = await Promise.all([
    cloudAWS.query('SELECT COUNT(*) FROM utilisateurs'),
    cloudGCP.query('SELECT COUNT(*) FROM utilisateurs'),
    cloudAzure.query('SELECT COUNT(*) FROM utilisateurs'),
  ]);

  return {
    aws: parseInt(awsData.rows[0].count),
    gcp: parseInt(gcpData.rows[0].count),
    azure: parseInt(azureData.rows[0].count),
    consistent:
      awsData.rows[0].count === gcpData.rows[0].count &&
      gcpData.rows[0].count === azureData.rows[0].count,
  };
}

module.exports = { insertUser, readFromCloud, checkConsistency };
