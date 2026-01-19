//user.test.js

const request = require('supertest');
const app = require('../app');

describe('Users Service Tests', () => {
  const testUser = {
    id: 9999,
    first_name: 'Test',
    last_name: 'User',
    birthday: '2000-01-01'
  };

  test('GET /api/users should return an array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/add should create a new user', async () => {
    const res = await request(app).post('/api/add').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('first_name', 'Test');
    expect(res.body).toHaveProperty('last_name', 'User');
    expect(res.body).toHaveProperty('id', 9999);
  });
});

