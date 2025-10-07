// Modified Package Model (Pkg.js)
import mongoose from "mongoose";

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const PkgCounter = mongoose.model('PkgCounter', counterSchema);

const pkgSchema = mongoose.Schema({
    ID: {
        type: String,
        unique: true
    },
    p_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    base_price: {
        type: Number,
        required: true
    },
    discount_rate: {
        type: Number,
        required: true
    },
    final_price: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    conditions: {
        type: String,
    },
    package_type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

// Pre-save hook to generate ID and calculate final price
pkgSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await PkgCounter.findOneAndUpdate(
                { _id: 'ID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.ID = 'package' + doc.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Pkg = mongoose.model('Pkg', pkgSchema);