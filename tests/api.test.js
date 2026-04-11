// ============================================================
// api.test.js - Tests automatisés de l'API
// Framework : Jest + Supertest
// Auteur : Etudiante M2 - ESP Antsiranana
// ============================================================

const request = require('supertest');
const app = require('../src/app');

// --- Tests de la route principale ---
describe('GET /', () => {
  test('Doit retourner un message de bienvenue', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Multi-Cloud');
  });
});

// --- Tests de la route /health ---
describe('GET /health', () => {
  test('Doit retourner status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// --- Tests de la route POST /users ---
describe('POST /users', () => {
  test('Doit retourner 400 si les champs sont manquants', async () => {
    const res = await request(app)
      .post('/users')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('Doit retourner 400 si email est manquant', async () => {
    const res = await request(app)
      .post('/users')
      .send({ nom: 'Test' });
    expect(res.statusCode).toBe(400);
  });

  test('Doit retourner 400 si nom est manquant', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
  });
});

// --- Tests de la route GET /users/:cloud ---
describe('GET /users/:cloud', () => {
  test('Doit retourner 400 pour un cloud inconnu', async () => {
    const res = await request(app).get('/users/oracle');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
