const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'argoconnect_super_secret_jwt_key_2026_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj
  });
};

// @desc    Register user (Buyer, Seller/Farmer, Admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, location, farmName, farmingType, farmSizeAcres } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'buyer',
      location: location || { state: 'Andhra Pradesh', district: 'Guntur', city: 'Tenali' }
    });

    // If registering as seller/farmer, create FarmerProfile
    if (user.role === 'seller') {
      await FarmerProfile.create({
        userId: user._id,
        farmName: farmName || `${user.name}'s Organic Farm`,
        farmingType: farmingType || 'Organic',
        farmSizeAcres: farmSizeAcres || 2,
        location: user.location
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let farmerProfile = null;

    if (user.role === 'seller') {
      farmerProfile = await FarmerProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      farmerProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      profileImage: req.body.profileImage
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (user.role === 'seller' && (req.body.farmName || req.body.farmingType)) {
      await FarmerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          farmName: req.body.farmName,
          farmingType: req.body.farmingType,
          description: req.body.farmDescription,
          location: user.location
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
