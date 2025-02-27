/**
 * Tests for the usage API endpoints
 */

const request = require('supertest');
const app = require('../server');

describe('Usage API Endpoints', () => {
  // Test GET all usage data
  describe('GET /api/usage', () => {
    it('should return all usage data', async () => {
      const res = await request(app).get('/api/usage');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by limit_reached', async () => {
      const res = await request(app).get('/api/usage?limit_reached=true');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // All returned users should have limit_reached set to TRUE
      res.body.data.forEach(user => {
        expect(user.limit_reached).toBe('TRUE');
      });
    });

    it('should paginate results', async () => {
      const limit = 5;
      const res = await request(app).get(`/api/usage?page=1&limit=${limit}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(limit);
    });
  });

  // Test GET user by email
  describe('GET /api/usage/:email', () => {
    it('should return a single user by email', async () => {
      const email = 'user1@example.com';
      const res = await request(app).get(`/api/usage/${email}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user_email).toBe(email);
    });

    it('should return 404 for non-existent user', async () => {
      const email = 'nonexistent@example.com';
      const res = await request(app).get(`/api/usage/${email}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  // Test GET users by tier
  describe('GET /api/usage/tier/:tier', () => {
    it('should return users filtered by tier', async () => {
      const tier = 'Free';
      const res = await request(app).get(`/api/usage/tier/${tier}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // All returned users should have the specified tier
      res.body.data.forEach(user => {
        expect(user.tier).toBe(tier);
      });
    });

    it('should return 400 for invalid tier', async () => {
      const tier = 'InvalidTier';
      const res = await request(app).get(`/api/usage/tier/${tier}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  // Test GET usage summary
  describe('GET /api/usage/stats/summary', () => {
    it('should return usage summary statistics', async () => {
      const res = await request(app).get('/api/usage/stats/summary');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('usersByTier');
      expect(res.body.data).toHaveProperty('usersReachedLimit');
      expect(res.body.data).toHaveProperty('avgApiCalls');
    });
  });
}); 