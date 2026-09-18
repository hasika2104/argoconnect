const { generateAIResponse } = require('../services/aiService');
const AIConversation = require('../models/AIConversation');

// @desc    Process Telugu/English AI Assistant message
// @route   POST /api/ai/chat
// @access  Public (Optional Auth header)
exports.chatWithAI = async (req, res, next) => {
  try {
    const { prompt, history, language } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid question or prompt.' });
    }

    const replyText = await generateAIResponse(prompt, history || []);

    // If user is authenticated, log conversation to MongoDB
    if (req.user) {
      let conversation = await AIConversation.findOne({ userId: req.user.id });

      if (!conversation) {
        conversation = new AIConversation({
          userId: req.user.id,
          messages: [],
          languagePreference: language || 'te'
        });
      }

      conversation.messages.push({ sender: 'user', text: prompt });
      conversation.messages.push({ sender: 'assistant', text: replyText });
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      response: replyText,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};
