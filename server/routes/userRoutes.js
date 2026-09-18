const express = require('express');
const { getUserProfile, updateFarmerProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/farmer-profile', authorize('seller'), updateFarmerProfile);

module.exports = router;
