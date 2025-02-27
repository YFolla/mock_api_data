/**
 * Routes for usage data API endpoints
 */

const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usage');

/**
 * @route   GET /api/usage
 * @desc    Get all usage data with optional filtering
 * @access  Public
 */
router.get('/', usageController.getAllUsage);

/**
 * @route   GET /api/usage/:email
 * @desc    Get usage data for a specific user by email
 * @access  Public
 */
router.get('/:email', usageController.getUserUsage);

/**
 * @route   GET /api/usage/tier/:tier
 * @desc    Get usage data filtered by tier (Free, Pro, Enterprise)
 * @access  Public
 */
router.get('/tier/:tier', usageController.getUsageByTier);

/**
 * @route   GET /api/usage/stats/summary
 * @desc    Get summary statistics of usage data
 * @access  Public
 */
router.get('/stats/summary', usageController.getUsageSummary);

module.exports = router; 