const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Vegetables',
      'Fruits',
      'Grains',
      'Pulses',
      'Spices',
      'Organic Products',
      'Dairy Products',
      'Seeds',
      'Other Agricultural Products'
    ],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit (e.g. kg, ton, bunch, liter)'],
    enum: ['kg', 'ton', 'gram', 'bunch', 'liter', 'piece', 'bag', 'box'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: 0,
    default: 100
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    state: { type: String, required: true, default: 'Andhra Pradesh' },
    district: { type: String, required: true, default: 'Guntur' },
    city: { type: String, default: 'Tenali' },
    village: { type: String, default: '' },
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.640, 16.243]
      }
    }
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
    index: true
  },
  harvestDate: {
    type: Date,
    default: Date.now
  },
  organicCertified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create text index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });
// Geospatial 2dsphere index for location queries
ProductSchema.index({ 'location.geo': '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);
