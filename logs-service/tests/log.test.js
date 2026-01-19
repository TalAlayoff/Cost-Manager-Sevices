//log.test.js

const request = require('supertest');
const app = require('../app');

describe('Logs Service Tests', () => {
  test('GET /api/logs should return an array', async () => {
    const res = await request(app).get('/api/logs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/add should create a new log', async () => {
  const logEntry = { method: 'GET', url: '/test', service: 'logs-service' };
  const res = await request(app).post('/api/add').send(logEntry);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('method', 'GET');
  expect(res.body).toHaveProperty('url', '/test');
  expect(res.body).toHaveProperty('service', 'logs-service');
});

});
