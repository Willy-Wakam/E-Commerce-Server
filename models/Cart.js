const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                name:{
                    type: String,
                    required: true,
                },
                imageUrl:{
                    type: String,
                    required: true,
                }
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", CartSchema);
