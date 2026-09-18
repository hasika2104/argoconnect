const Product = require('../models/Product');
const User = require('../models/User');
const { calculateDistance } = require('../utils/haversine');

// @desc    Get all products with filtering, search, location proximity & sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      state,
      district,
      city,
      lat,
      lng,
      maxDistance, // in km
      sort,
      sellerId
    } = req.query;

    let query = {
      isAvailable: true,
      approvalStatus: 'approved'
    };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by seller ID (if requested by seller for their products, ignore approval filter)
    if (sellerId) {
      delete query.approvalStatus;
      delete query.isAvailable;
      query.sellerId = sellerId;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Location string matching
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (city) query['location.city'] = new RegExp(city, 'i');

    let products = await Product.find(query)
      .populate('sellerId', 'name phone location profileImage')
      .sort(sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 });

    // Calculate distance if buyer coordinates provided
    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    let processedProducts = products.map(p => {
      const pObj = p.toObject();
      const pLat = pObj.location?.geo?.coordinates?.[1] || 16.243;
      const pLng = pObj.location?.geo?.coordinates?.[0] || 80.640;

      if (userLat !== null && userLng !== null) {
        pObj.distanceKm = calculateDistance(userLat, userLng, pLat, pLng);
      } else {
        pObj.distanceKm = null;
      }
      return pObj;
    });

    // Filter by maxDistance if provided
    if (maxDistance && userLat !== null && userLng !== null) {
      const radiusLimit = parseFloat(maxDistance);
      processedProducts = processedProducts.filter(p => p.distanceKm !== null && p.distanceKm <= radiusLimit);
    }

    // Sort by distance if requested
    if (sort === 'nearest' && userLat !== null && userLng !== null) {
      processedProducts.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    }

    res.status(200).json({
      success: true,
      count: processedProducts.length,
      products: processedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name phone location profileImage email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product listing
// @route   POST /api/products
// @access  Private (Seller/Farmer)
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      unit,
      quantity,
      images,
      location,
      lat,
      lng,
      organicCertified
    } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(f => `/uploads/${f.filename}`);
    } else if (images) {
      imageUrls = Array.isArray(images) ? images : [images];
    } else {
      imageUrls = ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];
    }

    const sellerUser = await User.findById(req.user.id);

    const productLocation = {
      state: location?.state || sellerUser.location?.state || 'Andhra Pradesh',
      district: location?.district || sellerUser.location?.district || 'Guntur',
      city: location?.city || sellerUser.location?.city || 'Tenali',
      village: location?.village || sellerUser.location?.village || '',
      geo: {
        type: 'Point',
        coordinates: [
          lng ? parseFloat(lng) : (sellerUser.location?.coordinates?.lng || 80.640),
          lat ? parseFloat(lat) : (sellerUser.location?.coordinates?.lat || 16.243)
        ]
      }
    };

    const product = await Product.create({
      sellerId: req.user.id,
      name,
      category,
      description,
      price: Number(price),
      unit: unit || 'kg',
      quantity: Number(quantity),
      images: imageUrls,
      location: productLocation,
      organicCertified: organicCertified === 'true' || organicCertified === true,
      approvalStatus: 'approved' // default auto approve for seamless demo experience
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private (Seller owner or Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check ownership or admin role
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller owner or Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
