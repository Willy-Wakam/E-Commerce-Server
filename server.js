const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth/authRoutes');
const adminProductsRouter = require('./routes/admin/productsRoutes');
const adminOrderRouter = require("./routes/admin/orderRoutes");
const adminUsersRouter = require("./routes/admin/usersRoutes");

const shopProductsRouter = require('./routes/shop/productsRoutes');
const shopCartRouter = require("./routes/shop/cartsRoutes");
const shopAddressRouter = require("./routes/shop/addressRoutes");
const shopOrderRouter = require("./routes/shop/ordersRoutes");
const shopSearchRouter = require("./routes/shop/searchRoutes");
const shopReviewRouter = require("./routes/shop/reviewsRoutes");

const commonFeatureRouter = require("./routes/common/featureRoutes");


require('dotenv').config();

// Database connection

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection Error:', err));

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://e-commerce-app-oa1v.onrender.com", // usually NOT needed as an origin, see note below
];

app.use(
    cors({
        origin: (origin, cb) => {
            // allow tools like Postman / server-to-server (no origin)
            if (!origin) return cb(null, true);

            if (allowedOrigins.includes(origin)) return cb(null, true);

            return cb(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
    })
)
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/admin/products', adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUsersRouter);

app.use('/api/shop/products', shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});