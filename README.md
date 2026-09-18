# Argoconnect – Smart Farmer Marketplace with AI Assistant 🌾

Argoconnect is a production-ready full-stack cloud web application designed to directly connect farmers (sellers) with consumers (buyers) across local regions, featuring an integrated **Telugu AI Agricultural Assistant** powered by Google Gemini AI.

---

## 🏗️ 1. Architecture Overview

```
User (Browser / Mobile)
        │
        ▼
Cloud Frontend (React.js + Vite + Tailwind CSS)
        │
        ├────────────▶ HTTPS REST APIs ──────────┐
        │                                        │
        ▼                                        ▼
Cloud Backend Service (Node.js + Express)   Google Gemini AI API (Telugu/English Assistant)
        │
        ├────────────▶ MongoDB Atlas (Managed Database + 2DSphere Geospatial Index)
        │
        └────────────▶ Cloud Object Storage (Cloudinary / Signed Uploads)
```

---

## 🚀 2. Features & User Roles

### 🛒 Buyer
- **Authentication**: JWT Login & Registration with local district preference.
- **Location-Based Discovery**: Radius filtering (10km, 25km, 50km, 100km) with Haversine distance computation.
- **Marketplace**: Search by crop name, category filter (Vegetables, Fruits, Grains, Pulses, Spices, Organic, Dairy, Seeds), price sort.
- **Shopping Cart**: Real-time quantity management, subtotal calculation.
- **Checkout & Orders**: Address specification, COD/UPI options, order tracking, purchase history.
- **AI Assistant**: Floating widget & dedicated page to query crop information in Telugu and English.

### 🌾 Farmer / Seller
- **Farmer Profile**: Farm name, organic certification status, farm size (acres), farming type, experience years.
- **Crop Management**: Create, edit, delete listings, update stock levels & prices, upload produce images.
- **Orders Management**: View received customer orders, update delivery status (`pending`, `processing`, `shipped`, `delivered`).
- **Sales Analytics**: Gross revenue counter, completed order breakdown.

### 🛡️ Admin
- **Dashboard Metrics**: Total users, enrolled farmers, registered buyers, listed produce, gross platform GMV.
- **Moderation**: Approve or reject newly submitted farmer produce listings.
- **User Management**: Filter and manage accounts by role (`buyer`, `seller`, `admin`).
- **Content Reports**: Platform security & audit logging.

---

## 📁 3. Folder Structure

```
argoconnect/
│
├── client/                     # Frontend React + Vite Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AIAssistantWidget, ProductCard, ProtectedRoute
│   │   ├── context/            # AuthContext, CartContext, LocationContext
│   │   ├── pages/              # 27 Full-featured views across Public, Buyer, Seller, Admin
│   │   ├── services/           # Axios API client with Bearer Token interceptor
│   │   ├── App.jsx             # Main router & provider wrapper
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Express.js REST API
│   ├── config/                 # MongoDB Atlas DB & Cloudinary storage configs
│   ├── controllers/            # auth, product, cart, order, user, admin, ai controllers
│   ├── middleware/             # JWT auth, Multer file upload, rate limit, error handler
│   ├── models/                 # Mongoose Schemas (User, FarmerProfile, Product, Cart, Order, AIConversation, Category)
│   ├── routes/                 # Express route definitions
│   ├── scripts/                # Database seeder (seed.js)
│   ├── services/               # Gemini AI prompt engineering service (aiService.js)
│   ├── tests/                  # Integration tests (api.test.js)
│   ├── utils/                  # Haversine distance math (haversine.js)
│   ├── app.js                  # Express setup
│   ├── server.js               # Entry point
│   └── package.json
│
├── .env.example                # Environment configuration template
└── package.json                # Root monorepo workspace scripts
```

---

## 🔑 4. Environment Variables Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/argoconnect?retryWrites=true&w=majority
JWT_SECRET=argoconnect_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Gemini AI API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Cloud Storage Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🗄️ 5. Database Schemas

- **User**: Name, email, hashed password (bcrypt), phone, role (`buyer`, `seller`, `admin`), nested location (state, district, city, coordinates).
- **FarmerProfile**: Farm name, farming type, acres, experience, verification status.
- **Product**: Name, category, price, unit, quantity, images, location (2DSphere coordinates), organic certified flag, approval status.
- **Cart**: Buyer reference, item array with quantity and price, auto-calculated total amount.
- **Order**: Buyer & Seller references, delivery address, payment method, order status.
- **AIConversation**: User query logs with Telugu/English response history.

---

## 📡 6. REST API Endpoints

### Auth
- `POST /api/auth/register` - Create user (Buyer, Farmer, Admin)
- `POST /api/auth/login` - Authenticate & return JWT
- `GET /api/auth/me` - Fetch profile of logged-in user

### Products & Marketplace
- `GET /api/products` - List products (filters: search, category, minPrice, maxPrice, radius, sort)
- `GET /api/products/:id` - Fetch single product details
- `POST /api/products` - Create product (Seller/Admin only)
- `PUT /api/products/:id` - Edit product
- `DELETE /api/products/:id` - Remove listing

### Cart & Checkout
- `GET /api/cart` - View buyer cart
- `POST /api/cart` - Add item
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Place produce order
- `GET /api/orders` - List buyer/seller orders
- `PUT /api/orders/:id/status` - Update status (`pending`, `shipped`, `delivered`)

### AI Telugu Assistant
- `POST /api/ai/chat` - Query Telugu/English AI Assistant

### Admin & System
- `GET /api/health` - API Service health check
- `GET /api/admin/stats` - Marketplace GMV and metrics
- `GET /api/admin/users` - User list & management
- `PUT /api/admin/products/:id/approve` - Moderation approval

---

## 🤖 7. AI Telugu Assistant Integration

The assistant uses Google Gemini AI (`@google/genai`) with system prompt instructions to:
- Respond in natural **Telugu** for Telugu queries (e.g. *"టమాటా పంటకు ఏ ఎరువు మంచిది?"*) and **English** for English queries.
- Provide practical advice on soil care, organic vermicompost, pest prevention, harvesting timing, and Argoconnect produce listings.
- Include **Safety Safeguards**: Explicitly instructs users to consult Krishi Vigyan Kendra (KVK) or local agriculture officers for exact chemical pesticide dosages.
- **API Security**: The API key is kept exclusively on the server side (`/api/ai/chat`) and never exposed to the frontend browser.
- **Fallback**: Includes an intelligent response fallback when running without an API key.

---

## 🔑 8. Test Credentials for Demo

Run `npm run seed` to populate the database with realistic test data and accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Buyer** | `buyer@argoconnect.com` | `buyer123` | Sita Buyer (Guntur) |
| **Farmer** | `farmer@argoconnect.com` | `farmer123` | Ramu Farmer (Tenali Organic Farm) |
| **Admin** | `admin@argoconnect.com` | `admin123` | Argoconnect Platform Admin |

---

## 🛠️ 9. Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm run setup
   ```

2. **Seed Database**:
   ```bash
   npm run seed
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - API Health Check: `http://localhost:5000/api/health`

4. **Run Automated Test Suite**:
   ```bash
   npm run test
   ```

---

## ☁️ 10. Cloud Deployment Guide

### A. MongoDB Atlas
1. Create a free Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add Database User & IP Access List (`0.0.0.0/0` for cloud deployment).
3. Copy connection string to `MONGODB_URI` in `.env`.

### B. Backend Deployment (Render / Railway / Heroku)
1. Push project to GitHub.
2. Link repository to Render / Railway web service.
3. Set Build Command: `cd server && npm install`
4. Set Start Command: `cd server && npm start`
5. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`).

### C. Frontend Deployment (Vercel / Netlify)
1. Link GitHub repository to Vercel/Netlify.
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

---

## 📜 License

MIT License © 2026 Argoconnect Team. Direct Farmer Marketplace.
