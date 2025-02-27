/**
 * Tests for the conversations API endpoints
 */

const request = require('supertest');
const app = require('../server');

describe('Conversations API Endpoints', () => {
  // Test GET all conversations
  describe('GET /api/conversations', () => {
    it('should return all conversations', async () => {
      const res = await request(app).get('/api/conversations');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by author', async () => {
      const res = await request(app).get('/api/conversations?author=user3');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      
      // The returned conversation should have messages from user3
      const hasUser3 = res.body.data[0].messages.some(
        msg => msg.author === 'user3'
      );
      expect(hasUser3).toBe(true);
    });

    it('should search message content', async () => {
      const res = await request(app).get('/api/conversations?search=slack');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // All returned conversations should contain the search term
      res.body.data.forEach(convo => {
        const hasSearchTerm = convo.messages.some(
          msg => msg.message.toLowerCase().includes('slack')
        );
        expect(hasSearchTerm).toBe(true);
      });
    });

    it('should paginate results', async () => {
      const limit = 2;
      const res = await request(app).get(`/api/conversations?page=1&limit=${limit}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(limit);
    });
  });

  // Test GET conversation by ID
  describe('GET /api/conversations/:id', () => {
    it('should return a single conversation by ID', async () => {
      const id = 'conv1';
      const res = await request(app).get(`/api/conversations/${id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversation_id).toBe(id);
    });

    it('should return 404 for non-existent conversation', async () => {
      const id = 'nonexistent';
      const res = await request(app).get(`/api/conversations/${id}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  // Test GET conversation stats
  describe('GET /api/conversations/stats/summary', () => {
    it('should return conversation summary statistics', async () => {
      const res = await request(app).get('/api/conversations/stats/summary');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalConversations');
      expect(res.body.data).toHaveProperty('totalMessages');
      expect(res.body.data).toHaveProperty('messagesByAuthorType');
      expect(res.body.data).toHaveProperty('avgMessagesPerConversation');
      expect(res.body.data).toHaveProperty('sentimentAnalysis');
    });
  });
}); 