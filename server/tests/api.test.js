const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');

let mongoServer;
let buyerToken, sellerToken, adminToken;
let sellerId, buyerId, productId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register Admin
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Admin',
      email: 'admin_test@argo.com',
      password: 'password123',
      phone: '9900000001',
      role: 'admin'
    });
  adminToken = adminRes.body.token;

  // Register Seller
  const sellerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Farmer',
      email: 'farmer_test@argo.com',
      password: 'password123',
      phone: '9900000002',
      role: 'seller',
      farmName: 'Green Meadows Organic'
    });
  sellerToken = sellerRes.body.token;
  sellerId = sellerRes.body.user._id;

  // Register Buyer
  const buyerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Buyer',
      email: 'buyer_test@argo.com',
      password: 'password123',
      phone: '9900000003',
      role: 'buyer'
    });
  buyerToken = buyerRes.body.token;
  buyerId = buyerRes.body.user._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('1. Authentication Endpoints', () => {
  it('should authenticate registered buyer and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'buyer_test@argo.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  it('should get current user profile with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('buyer_test@argo.com');
  });
});

describe('2. Products Endpoints', () => {
  it('should allow seller to create a product listing', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'Fresh Organic Spinach',
        category: 'Vegetables',
        description: 'Pesticide free leafy green spinach',
        price: 25,
        unit: 'kg',
        quantity: 50,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe('Fresh Organic Spinach');
    productId = res.body.product._id;
  });

  it('should retrieve list of approved products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });
});

describe('3. Cart & Order Endpoints', () => {
  it('should allow buyer to add product to cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId,
        quantity: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items.length).toBe(1);
  });

  it('should place order successfully for buyer', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        deliveryAddress: {
          fullName: 'Test Buyer',
          phone: '9900000003',
          addressLine: '123 Harvest Road',
          city: 'Guntur',
          district: 'Guntur',
          state: 'Andhra Pradesh',
          pincode: '522002'
        },
        paymentMethod: 'COD'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order.status).toBe('pending');
  });
});

describe('4. AI Telugu Assistant Endpoint', () => {
  it('should return crop assistance response for Telugu prompt', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        prompt: 'టమాటా పంటకు ఏ ఎరువు వాడాలి?'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.response).toBe('string');
  });
});
