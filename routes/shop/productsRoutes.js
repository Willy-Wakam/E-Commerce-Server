const express = require("express");
const {
    getFilterProducts,
    getProductById
} = require("../../controllers/shop/productsController");

const router = express.Router();

// Route to handle image upload
router.get("/get", getFilterProducts);
router.get("/get/:id", getProductById)

module.exports = router;
