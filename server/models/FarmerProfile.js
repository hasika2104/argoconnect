const mongoose = require('mongoose');

const FarmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  farmName: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true
  },
  description: {
    type: String,
    default: 'Passionate farmer providing fresh, high quality produce directly from farm to table.'
  },
  farmingType: {
    type: String,
    enum: ['Organic', 'Traditional', 'Hydroponic', 'Mixed', 'Natural Farming'],
    default: 'Organic'
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  farmSizeAcres: {
    type: Number,
    default: 2.5
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified'
  },
  location: {
    state: { type: String, default: 'Andhra Pradesh' },
    district: { type: String, default: 'Guntur' },
    city: { type: String, default: 'Tenali' },
    village: { type: String, default: 'Kaza' },
    coordinates: {
      lat: { type: Number, default: 16.243 },
      lng: { type: Number, default: 80.640 }
    }
  },
  certificationDetails: { type: String, default: 'Certified Organic / Local AP Farmer ID Verified' }
}, { timestamps: true });

module.exports = mongoose.model('FarmerProfile', FarmerProfileSchema);
