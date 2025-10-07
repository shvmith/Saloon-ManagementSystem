import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
       
        ItemName: {
            type: String,
            required: true,
        },
        Category: {
            type: String,
            required: true,
        },
        Quantity: {
            type: String,
            required: true,
        },
        Price: {
            type: String,
            required: true,
        },
        SupplierName: {
            type: String,
            required: true,
        },
        SupplierEmail: {
            type: String,
            required: true,
        },
        retrievalHistory: [{
            quantity: Number,
            retrievedAt: {
                type: Date,
                default: Date.now
            }
        }],
    },
    { timestamps: true }
);

const inventory = mongoose.model("inventory", inventorySchema);

export default inventory;