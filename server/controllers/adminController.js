const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const FarmerProfile = require('../models/FarmerProfile');

// @desc    Get marketplace overall stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ approvalStatus: 'pending' });
    
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = await Order.find()
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalProducts,
        pendingProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filter by role
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAdminUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete own admin account' });
    }

    await user.deleteOne();
    await FarmerProfile.deleteOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin management
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAdminProducts = async (req, res, next) => {
  try {
    const { approvalStatus, category } = req.query;
    let query = {};

    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (category) query.category = category;

    const products = await Product.find(query)
      .populate('sellerId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject product listing
// @route   PUT /api/admin/products/:id/approve
// @access  Private (Admin)
exports.approveProduct = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body; // 'approved' or 'rejected'
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.approvalStatus = approvalStatus || 'approved';
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};
