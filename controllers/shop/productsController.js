const Product = require("../../models/Product")

const getFFilterProducts = async (req, res) => {
    try {
        const products = await Product.find({isDeleted: false});
        res.status(200).json({
            success: true,
            data: products
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occured"
        })
    }
}

module.exports = {getFFilterProducts}