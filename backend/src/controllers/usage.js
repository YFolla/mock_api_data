/**
 * Controllers for usage data API endpoints
 */

const path = require('path');
const fs = require('fs').promises;

// Path to the mock data file
const dataFilePath = path.join(__dirname, '../data/mock_usage.json');

/**
 * Helper function to read the usage data from the JSON file
 * @returns {Promise<Array>} The usage data as an array of objects
 */
const readUsageData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading usage data:', error);
    throw new Error('Failed to read usage data');
  }
};

/**
 * Get all usage data with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllUsage = async (req, res, next) => {
  try {
    const usageData = await readUsageData();
    
    // Apply query filters if provided
    let filteredData = [...usageData];
    
    // Filter by limit_reached
    if (req.query.limit_reached) {
      const limitReached = req.query.limit_reached.toLowerCase() === 'true';
      filteredData = filteredData.filter(user => 
        user.limit_reached.toLowerCase() === String(limitReached).toLowerCase()
      );
    }
    
    // Filter by minimum API calls
    if (req.query.min_api_calls) {
      const minApiCalls = parseInt(req.query.min_api_calls);
      if (!isNaN(minApiCalls)) {
        filteredData = filteredData.filter(user => user.api_calls >= minApiCalls);
      }
    }
    
    // Filter by maximum API calls
    if (req.query.max_api_calls) {
      const maxApiCalls = parseInt(req.query.max_api_calls);
      if (!isNaN(maxApiCalls)) {
        filteredData = filteredData.filter(user => user.api_calls <= maxApiCalls);
      }
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || filteredData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    // Response with pagination metadata
    res.status(200).json({
      success: true,
      count: filteredData.length,
      page,
      limit,
      data: paginatedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get usage data for a specific user by email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserUsage = async (req, res, next) => {
  try {
    const usageData = await readUsageData();
    const userEmail = req.params.email;
    
    const userData = usageData.find(user => 
      user.user_email.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: `User with email ${userEmail} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get usage data filtered by tier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUsageByTier = async (req, res, next) => {
  try {
    const usageData = await readUsageData();
    const tier = req.params.tier;
    
    const validTiers = ['Free', 'Pro', 'Enterprise'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        message: `Invalid tier. Must be one of: ${validTiers.join(', ')}`
      });
    }
    
    const tierData = usageData.filter(user => 
      user.tier === tier
    );
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || tierData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedData = tierData.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: tierData.length,
      page,
      limit,
      data: paginatedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get summary statistics of usage data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUsageSummary = async (req, res, next) => {
  try {
    const usageData = await readUsageData();
    
    // Calculate summary statistics
    const totalUsers = usageData.length;
    
    // Count users by tier
    const usersByTier = usageData.reduce((acc, user) => {
      acc[user.tier] = (acc[user.tier] || 0) + 1;
      return acc;
    }, {});
    
    // Count users who reached their limit
    const usersReachedLimit = usageData.filter(
      user => user.limit_reached.toLowerCase() === 'true'
    ).length;
    
    // Calculate average API calls and errors
    const totalApiCalls = usageData.reduce((sum, user) => sum + user.api_calls, 0);
    const totalErrors = usageData.reduce((sum, user) => sum + user.errors, 0);
    const totalChatQuestions = usageData.reduce((sum, user) => sum + user.chat_questions, 0);
    
    const avgApiCalls = totalApiCalls / totalUsers;
    const avgErrors = totalErrors / totalUsers;
    const avgChatQuestions = totalChatQuestions / totalUsers;
    
    // Calculate average API calls by tier
    const apiCallsByTier = {};
    Object.keys(usersByTier).forEach(tier => {
      const tierUsers = usageData.filter(user => user.tier === tier);
      const tierTotalApiCalls = tierUsers.reduce((sum, user) => sum + user.api_calls, 0);
      apiCallsByTier[tier] = tierTotalApiCalls / tierUsers.length;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersByTier,
        usersReachedLimit,
        avgApiCalls,
        avgErrors,
        avgChatQuestions,
        apiCallsByTier
      }
    });
  } catch (error) {
    next(error);
  }
}; 