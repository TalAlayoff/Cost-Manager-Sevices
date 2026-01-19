const request = require('supertest');
const app = require('../app');

describe('Costs Service Tests', () => {
  const testUserId = 123123;

  test('GET /api/report should return empty costs initially', async () => {
    const res = await request(app).get(`/api/report/?id=${testUserId}&year=2026&month=1`);
    expect(res.status).toBe(200);
    expect(res.body.costs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ food: [] }),
        expect.objectContaining({ health: [] }),
        expect.objectContaining({ housing: [] }),
        expect.objectContaining({ sports: [] }),
        expect.objectContaining({ education: [] })
      ])
    );
  });

  test('POST /api/add should add a cost item', async () => {
    const newCost = {
      userid: testUserId,
      description: 'milk 9',
      category: 'food',
      sum: 8,
      date: new Date()
    };
    const res = await request(app).post('/api/add').send(newCost);
    expect(res.status).toBe(201);
    expect(res.body.description).toBe(newCost.description);
    expect(res.body.sum).toBe(newCost.sum);
    expect(res.body.category).toBe(newCost.category);
  });

  test('GET /api/report should return the newly added cost', async () => {
    const res = await request(app).get(`/api/report/?id=${testUserId}&year=2026&month=1`);
    expect(res.status).toBe(200);
    const foodCosts = res.body.costs.find(c => c.food.length > 0).food;
    expect(foodCosts[0]).toHaveProperty('description', 'milk 9');
    expect(foodCosts[0]).toHaveProperty('sum', 8);
  });
});
