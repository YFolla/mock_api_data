/**
 * Routes for conversations data API endpoints
 */

const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations');

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations data with optional filtering
 * @access  Public
 */
router.get('/', conversationsController.getAllConversations);

/**
 * @route   GET /api/conversations/stats/summary
 * @desc    Get summary statistics of conversations data
 * @access  Public
 */
router.get('/stats/summary', conversationsController.getConversationStats);

/**
 * @route   GET /api/conversations/:id
 * @desc    Get a specific conversation by ID
 * @access  Public
 */
router.get('/:id', conversationsController.getConversationById);

module.exports = router; 