const { uploadImage } = require("../../helper/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file?.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await uploadImage(url);
    return res.status(200).json({
      message: "Image uploaded successfully",
      result: result,
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  // Implementation for adding a new product
  try {
    const {
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      brand,
      salePrice,
    } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Here you would typically save the product to your database
    // For example:
    const newProduct = await Product.create({
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      brand,
      salePrice,
    });
    return res.status(201).json({
      message: "Product added successfully",
      success: true,
      // product: newProduct,
      product: newProduct, // Mock response
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Failed to add product" });
  }
};

// fetch all products
const fetchAllProducts = async (req, res) => {
  // Implementation for fetching all products
  try {
    const products = await Product.find({ isDeleted: false });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products: products, // Mock response
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

// edit product
const editProduct = async (req, res) => {
  // Implementation for editing a product
  try {
    const { id } = req.params; // Assuming the product ID is passed in the URL
    const {
      name,
      price,
      description,
      category,
      imageUrl,
      stock: stock,
      brand,
      salePrice,
    } = req.body;

    // Validate required fields
    if (!id || !name || !price || !description || !category || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Here you would typically update the product in your database
    // For example:
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        category,
        imageUrl,
        stock,
        brand,
        salePrice,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product edited successfully",
      success: true,
      product: updatedProduct, // Mock response
    });
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).json({ error: "Failed to edit product" });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  // Implementation for deleting a product
  try {
    const { id } = req.params; // Assuming the product ID is passed in the URL

    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Here you would typically delete the product from your database
    // For example:
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      product: deletedProduct, // Mock response
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
