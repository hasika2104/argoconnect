const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Buyer)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    let orderItems = [];

    // If items provided directly in request body (e.g. Buy Now)
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product not found (${item.productId})` });
        }
        if (product.quantity < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          unit: product.unit,
          images: product.images
        });
      }
    } else {
      // Checkout from cart
      const cart = await Cart.findOne({ buyerId: req.user.id }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      for (const item of cart.items) {
        const product = item.productId;
        if (!product || product.quantity < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product ? product.name : 'item'}` });
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          unit: product.unit,
          images: product.images
        });
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid items to place order' });
    }

    // Group items by seller so each farmer receives their relevant order segment
    // Or create order per primary seller
    const firstProduct = await Product.findById(orderItems[0].productId);
    const sellerId = firstProduct ? firstProduct.sellerId : req.user.id;

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await Order.create({
      buyerId: req.user.id,
      sellerId: sellerId,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || {
        fullName: req.user.name,
        phone: req.user.phone,
        addressLine: req.user.location?.address || 'Main Road',
        city: req.user.location?.city || 'Tenali',
        district: req.user.location?.district || 'Guntur',
        state: req.user.location?.state || 'Andhra Pradesh',
        pincode: '522201'
      },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'completed',
      status: 'pending'
    });

    // Update stock levels
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Clear buyer's cart after order placement
    await Cart.findOneAndUpdate({ buyerId: req.user.id }, { items: [], totalAmount: 0 });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (Role dependent: Buyer gets own orders, Seller gets orders for their products, Admin gets all)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'buyer') {
      query.buyerId = req.user.id;
    } else if (req.user.role === 'seller') {
      query.sellerId = req.user.id;
    }
    // Admin sees all orders

    const orders = await Order.find(query)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email phone location')
      .populate('sellerId', 'name email phone location');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      order.buyerId._id.toString() !== req.user.id &&
      order.sellerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller or Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};
