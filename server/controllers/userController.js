const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');

// @desc    Get user profile by ID or current user
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
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

// @desc    Update farmer profile details
// @route   PUT /api/users/farmer-profile
// @access  Private (Seller)
exports.updateFarmerProfile = async (req, res, next) => {
  try {
    const { farmName, description, farmingType, farmSizeAcres, experienceYears, location } = req.body;

    let farmerProfile = await FarmerProfile.findOne({ userId: req.user.id });

    if (!farmerProfile) {
      farmerProfile = new FarmerProfile({ userId: req.user.id });
    }

    if (farmName) farmerProfile.farmName = farmName;
    if (description) farmerProfile.description = description;
    if (farmingType) farmerProfile.farmingType = farmingType;
    if (farmSizeAcres) farmerProfile.farmSizeAcres = farmSizeAcres;
    if (experienceYears) farmerProfile.experienceYears = experienceYears;
    if (location) farmerProfile.location = location;

    await farmerProfile.save();

    res.status(200).json({
      success: true,
      farmerProfile
    });
  } catch (error) {
    next(error);
  }
};
