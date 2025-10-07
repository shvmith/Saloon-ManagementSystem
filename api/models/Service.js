import mongoose from "mongoose";

// Counter Schema
const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

// Model for the counter collection
const ServiceCounter = mongoose.model('ServiceCounter', counterSchema);

// Service Schema
const serviceSchema = mongoose.Schema(
    {
        service_ID: {
            type: String,
            unique: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        available: {
            type: String,
            required: true
        },
        subCategory: {
            type: String,
            required: true
        },
        image: {
            type: String,
        }
    }
);

// Pre-save hook to generate service_ID
serviceSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await ServiceCounter.findOneAndUpdate(
                { _id: 'service_ID' }, // The ID for this counter in the counter collection
                { $inc: { seq: 1 } }, // Increment the sequence by 1
                { new: true, upsert: true } // Create a new counter if it doesn't exist
            );
            this.service_ID = 'service' + doc.seq; // Assigning incremental service_ID
        }
        next();
    } catch (error) {
        next(error); // Pass any error to the error handler
    }
});

// Export the Service model
export const Service = mongoose.model('Service', serviceSchema);