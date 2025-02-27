/**
 * Controllers for conversations data API endpoints
 */

const path = require('path');
const fs = require('fs').promises;

// Path to the mock data file
const dataFilePath = path.join(__dirname, '../data/mock_convo.json');

/**
 * Helper function to read the conversations data from the JSON file
 * @returns {Promise<Array>} The conversations data as an array of objects
 */
const readConversationsData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading conversations data:', error);
    throw new Error('Failed to read conversations data');
  }
};

/**
 * Get all conversations data with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllConversations = async (req, res, next) => {
  try {
    const conversationsData = await readConversationsData();
    
    // Apply query filters if provided
    let filteredData = [...conversationsData];
    
    // Filter by author
    if (req.query.author) {
      filteredData = filteredData.filter(convo => 
        convo.messages.some(msg => msg.author.toLowerCase() === req.query.author.toLowerCase())
      );
    }
    
    // Filter by message content (search)
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredData = filteredData.filter(convo => 
        convo.messages.some(msg => msg.message.toLowerCase().includes(searchTerm))
      );
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
 * Get a specific conversation by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getConversationById = async (req, res, next) => {
  try {
    const conversationsData = await readConversationsData();
    const conversationId = req.params.id;
    
    const conversation = conversationsData.find(convo => 
      convo.conversation_id === conversationId
    );
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: `Conversation with ID ${conversationId} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get summary statistics of conversations data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getConversationStats = async (req, res, next) => {
  try {
    const conversationsData = await readConversationsData();
    
    // Calculate summary statistics
    const totalConversations = conversationsData.length;
    
    // Count total messages
    const totalMessages = conversationsData.reduce((sum, convo) => 
      sum + convo.messages.length, 0
    );
    
    // Count messages by author type
    const messagesByAuthorType = conversationsData.reduce((acc, convo) => {
      convo.messages.forEach(msg => {
        const authorType = msg.author.startsWith('user') ? 'user' : 'chatbot';
        acc[authorType] = (acc[authorType] || 0) + 1;
      });
      return acc;
    }, {});
    
    // Calculate average messages per conversation
    const avgMessagesPerConversation = totalMessages / totalConversations;
    
    // Identify positive and negative conversations
    const sentimentAnalysis = conversationsData.reduce((acc, convo) => {
      // Simple sentiment analysis based on last user message
      const userMessages = convo.messages.filter(msg => msg.author.startsWith('user'));
      const lastUserMessage = userMessages[userMessages.length - 1]?.message.toLowerCase() || '';
      
      // Very simple sentiment detection
      const positiveTerms = ['great', 'awesome', 'thanks', 'perfect', 'works'];
      const negativeTerms = ['doesn\'t work', 'not helpful', 'disappointing', 'bummer', 'useless'];
      
      let sentiment = 'neutral';
      if (positiveTerms.some(term => lastUserMessage.includes(term))) {
        sentiment = 'positive';
      } else if (negativeTerms.some(term => lastUserMessage.includes(term))) {
        sentiment = 'negative';
      }
      
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      data: {
        totalConversations,
        totalMessages,
        messagesByAuthorType,
        avgMessagesPerConversation,
        sentimentAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
}; 