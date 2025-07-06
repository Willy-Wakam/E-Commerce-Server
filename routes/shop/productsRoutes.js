const express = require("express");
const {
    getFFilterProducts,
    getProductById
} = require("../../controllers/shop/productsController");

const router = express.Router();

// Route to handle image upload
router.get("/get", getFFilterProducts);
router.get("/get/:id", getProductById)

module.exports = router;
