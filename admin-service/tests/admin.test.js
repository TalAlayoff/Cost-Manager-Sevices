const request = require('supertest');
const app = require('../app'); // <-- import app, NOT server.js

describe('Admin Service Tests', () => {
  test('GET /api/about should return developer information', async () => {
    const response = await request(app).get('/api/about');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  test('GET /api/about should return developers with first_name and last_name', async () => {
    const response = await request(app).get('/api/about');
    expect(response.status).toBe(200);
    response.body.forEach(dev => {
      expect(dev).toHaveProperty('first_name');
      expect(dev).toHaveProperty('last_name');
      expect(Object.keys(dev)).toHaveLength(2);
    });
  });

  test('GET /api/about should return Tal Alayoff and Roie Bohris', async () => {
    const response = await request(app).get('/api/about');
    const names = response.body.map(dev => `${dev.first_name} ${dev.last_name}`);
    expect(names).toContain('Tal Alayoff');
    expect(names).toContain('Roie Bohris');
  });
});
