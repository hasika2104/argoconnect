const express = require('express');
const {
  getAdminStats,
  getAdminUsers,
  deleteUser,
  getAdminProducts,
  approveProduct
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteUser);
router.get('/products', getAdminProducts);
router.put('/products/:id/approve', approveProduct);

module.exports = router;
