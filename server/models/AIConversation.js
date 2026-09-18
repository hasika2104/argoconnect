const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const AIConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  messages: [MessageSchema],
  languagePreference: {
    type: String,
    enum: ['te', 'en', 'auto'],
    default: 'te'
  }
}, { timestamps: true });

module.exports = mongoose.model('AIConversation', AIConversationSchema);
