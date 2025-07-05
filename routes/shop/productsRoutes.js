const express = require("express");
const {
    getFFilterProducts
} = require("../../controllers/shop/productsController");

const router = express.Router();

// Route to handle image upload
router.get("/get", getFFilterProducts);

module.exports = router;
