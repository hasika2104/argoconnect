const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate total cart amount
const calculateCartTotal = (cart) => {
  return cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// @desc    Get buyer cart
// @route   GET /api/cart
// @access  Private (Buyer)
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ buyerId: req.user.id })
      .populate({
        path: 'items.productId',
        populate: { path: 'sellerId', select: 'name phone location' }
      });

    if (!cart) {
      cart = await Cart.create({ buyerId: req.user.id, items: [], totalAmount: 0 });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (Buyer)
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.isAvailable || product.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    const qtyToAdd = Number(quantity) || 1;
    if (qtyToAdd > product.quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.quantity} ${product.unit} available in stock` });
    }

    let cart = await Cart.findOne({ buyerId: req.user.id });

    if (!cart) {
      cart = new Cart({ buyerId: req.user.id, items: [], totalAmount: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qtyToAdd;
      if (newQty > product.quantity) {
        return res.status(400).json({ success: false, message: `Cannot add more. Max stock is ${product.quantity} ${product.unit}` });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        productId,
        quantity: qtyToAdd,
        price: product.price
      });
    }

    cart.totalAmount = calculateCartTotal(cart);
    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      populate: { path: 'sellerId', select: 'name phone location' }
    });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private (Buyer)
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ buyerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const product = await Product.findById(item.productId);
    if (product && quantity > product.quantity) {
      return res.status(400).json({ success: false, message: `Cannot exceed available stock of ${product.quantity}` });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Number(quantity);
    }

    cart.totalAmount = calculateCartTotal(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      populate: { path: 'sellerId', select: 'name phone location' }
    });

    res.status(200).json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private (Buyer)
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ buyerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    cart.totalAmount = calculateCartTotal(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      populate: { path: 'sellerId', select: 'name phone location' }
    });

    res.status(200).json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};
