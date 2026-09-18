const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const categoriesData = [
  { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm vegetables directly harvested', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fruits', slug: 'fruits', description: 'Sweet and juicy seasonal farm fresh fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Grains', slug: 'grains', description: 'Premium rice, wheat, and unrefined grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pulses', slug: 'pulses', description: 'High protein pulses, lentils, and dal', image: 'https://images.unsplash.com/photo-1515543904379-3d757abe9962?auto=format&fit=crop&w=600&q=80' },
  { name: 'Spices', slug: 'spices', description: 'Aromatic pure spices and turmeric', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Organic Products', slug: 'organic-products', description: 'Zero chemical certified organic crops', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dairy Products', slug: 'dairy-products', description: 'Fresh farm cow & buffalo milk and ghee', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80' },
  { name: 'Seeds', slug: 'seeds', description: 'High yielding farm seeds and saplings', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
  { name: 'Other Agricultural Products', slug: 'other-agricultural-products', description: 'Jaggery, coconut oil, and natural honey', image: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?auto=format&fit=crop&w=600&q=80' }
];

const seedDatabase = async (quiet = false, exitProcess = true) => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/argoconnect';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connStr);
    }
    if (!quiet) console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await FarmerProfile.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    if (!quiet) console.log('[Seed] Cleared old collection data.');

    // 1. Seed Categories
    await Category.insertMany(categoriesData);
    if (!quiet) console.log('[Seed] Seeded categories.');

    // 2. Seed Users
    const admin = await User.create({
      name: 'Argoconnect Admin',
      email: 'admin@argoconnect.com',
      password: 'admin123',
      phone: '+91 9876543210',
      role: 'admin',
      location: { state: 'Andhra Pradesh', district: 'Guntur', city: 'Vijayawada', address: 'Market Road' }
    });

    const farmer = await User.create({
      name: 'Ramu Farmer (రాము రైతు)',
      email: 'farmer@argoconnect.com',
      password: 'farmer123',
      phone: '+91 9123456789',
      role: 'seller',
      location: {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        city: 'Tenali',
        village: 'Kaza',
        address: 'Farm Field 12, Kaza Village',
        coordinates: { lat: 16.243, lng: 80.640 }
      }
    });

    const buyer = await User.create({
      name: 'Sita Buyer (సీత)',
      email: 'buyer@argoconnect.com',
      password: 'buyer123',
      phone: '+91 9988776655',
      role: 'buyer',
      location: {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        city: 'Guntur City',
        address: 'Brodipet 4th Line',
        coordinates: { lat: 16.306, lng: 80.436 }
      }
    });

    if (!quiet) console.log('[Seed] Seeded test users (Admin, Farmer, Buyer).');

    // 3. Seed FarmerProfile
    await FarmerProfile.create({
      userId: farmer._id,
      farmName: 'రాము శ్రీ లక్ష్మి ఆర్గానిక్ ఫామ్ (Ramu Sri Lakshmi Organic Farm)',
      description: 'We grow 100% natural, pesticide-free fresh vegetables, Guntur chilli, and organic Sona Masoori rice using traditional Jeevamrutam techniques.',
      farmingType: 'Organic',
      experienceYears: 12,
      farmSizeAcres: 5.5,
      verificationStatus: 'verified',
      location: farmer.location
    });
    if (!quiet) console.log('[Seed] Seeded Farmer Profile.');

    // 4. Seed Products
    const productsData = [
      {
        sellerId: farmer._id,
        name: 'Fresh Farm Tomatoes (తాజా టమాటాలు)',
        category: 'Vegetables',
        description: 'Vine-ripened, naturally grown juicy red tomatoes harvested directly this morning.',
        price: 35,
        unit: 'kg',
        quantity: 250,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          city: 'Tenali',
          village: 'Kaza',
          geo: { type: 'Point', coordinates: [80.640, 16.243] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: true
      },
      {
        sellerId: farmer._id,
        name: 'Guntur Red Chilli (గుంటూరు మిరపకాయలు)',
        category: 'Spices',
        description: 'Authentic fiery red chili dry pods grown in Guntur fertile soils, sun-dried naturally.',
        price: 180,
        unit: 'kg',
        quantity: 500,
        images: ['https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          city: 'Tenali',
          village: 'Kaza',
          geo: { type: 'Point', coordinates: [80.640, 16.243] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: false
      },
      {
        sellerId: farmer._id,
        name: 'Organic Sona Masoori Rice (ఆర్గానిక్ సోనా మసూరి బియ్యం)',
        category: 'Grains',
        description: 'Aromatic aged single-polished Sona Masoori raw rice grown without synthetic fertilizers.',
        price: 65,
        unit: 'kg',
        quantity: 1200,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          city: 'Tenali',
          village: 'Kaza',
          geo: { type: 'Point', coordinates: [80.640, 16.243] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: true
      },
      {
        sellerId: farmer._id,
        name: 'Pure Desi Cow Ghee (నాటు ఆవు నెయ్యి)',
        category: 'Dairy Products',
        description: 'Traditional Bilona method golden A2 cow ghee crafted with rich aroma and granular texture.',
        price: 850,
        unit: 'liter',
        quantity: 40,
        images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          city: 'Tenali',
          village: 'Kaza',
          geo: { type: 'Point', coordinates: [80.640, 16.243] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: true
      },
      {
        sellerId: farmer._id,
        name: 'Fresh Organic Carrots (తాజా క్యారెట్లు)',
        category: 'Vegetables',
        description: 'Crunchy sweet crisp carrots full of beta-carotene.',
        price: 45,
        unit: 'kg',
        quantity: 150,
        images: ['https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          city: 'Tenali',
          village: 'Kaza',
          geo: { type: 'Point', coordinates: [80.640, 16.243] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: true
      },
      {
        sellerId: farmer._id,
        name: 'Farm Fresh Sweet Mangoes (మామిడి పళ్ళు)',
        category: 'Fruits',
        description: 'Naturally tree-ripened Banganapalli mangoes directly from farm orchards.',
        price: 120,
        unit: 'kg',
        quantity: 300,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'],
        location: {
          state: 'Andhra Pradesh',
          district: 'Krishna',
          city: 'Vijayawada',
          village: 'Nuzvid',
          geo: { type: 'Point', coordinates: [80.840, 16.780] }
        },
        isAvailable: true,
        approvalStatus: 'approved',
        organicCertified: true
      }
    ];

    await Product.insertMany(productsData);
    if (!quiet) console.log('[Seed] Seeded products.');

    if (!quiet) {
      console.log('\n==========================================');
      console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
      console.log('==========================================');
      console.log('Test Account Credentials:');
      console.log('  Admin:  admin@argoconnect.com  / admin123');
      console.log('  Farmer: farmer@argoconnect.com / farmer123');
      console.log('  Buyer:  buyer@argoconnect.com  / buyer123');
      console.log('==========================================\n');
    }

    if (exitProcess) process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    if (exitProcess) process.exit(1);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[AutoSeed] Empty database detected. Auto-seeding initial demo data...');
      await seedDatabase(true, false);
    }
  } catch (err) {
    console.warn('[AutoSeed Warning]', err.message);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, autoSeedIfEmpty };
