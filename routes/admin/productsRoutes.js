

const express = require('express');
const { handleImageUpload, addProduct, editProduct, fetchAllProducts, deleteProduct } = require('../../controllers/admin/productsController');

const { upload } = require('../../helper/cloudinary');

const router = express.Router();

// Route to handle image upload
router.post('/upload-image', upload.single('my_file'), handleImageUpload);
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.get('/fetch', fetchAllProducts);
router.delete('/delete/:id', deleteProduct);

module.exports = router;