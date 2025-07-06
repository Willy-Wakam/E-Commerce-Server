const Product = require("../../models/Product");

const getFFilterProducts = async (req, res) => {
  try {
    const { Category = "", Brand = "", sortBy = "" } = req.query;

    let filters = {
      isDeleted: false,
    };
    if (Category.length) {
      filters.category = { $in: Category.split(",") };
    }
    if (Brand.length) {
      filters.brand = { $in: Brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowToHigh":
        sort.price = 1;
        break;
      case "price-highToLow":
        sort.price = -1;
        break;
      case "name-aToz":
        sort.name = 1;
        break;
      case "name-zToa":
        sort.name = -1;
        break;
      default:
        sort.price = 1;
        break;
    }
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = { getFFilterProducts, getProductById };
