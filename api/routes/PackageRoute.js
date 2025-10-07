// PackageRoute.js
import express from 'express';
import { Pkg } from '../models/packageModel.js';
import { Service } from '../models/Service.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to validate required fields
const validateFields = (req, res, next) => {
    const requiredFields = [
        'p_name',
        'description',
        'services',
        'base_price',
        'discount_rate',
        'start_date',
        'end_date',
        'package_type',
        'category'
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

// Create a new package
router.post('/', validateFields, async (req, res) => {
    try {
        const {
            p_name,
            description,
            services,
            base_price,
            discount_rate,
            start_date,
            end_date,
            conditions,
            package_type,
            category
        } = req.body;

        // Validate service IDs
        const validServices = await Service.find({ '_id': { $in: services } });
        if (validServices.length !== services.length) {
            return res.status(400).json({ message: 'One or more service IDs are invalid' });
        }

        // Calculate final price
        const final_price = base_price * (1 - discount_rate / 100);

        const newPackage = new Pkg({
            p_name,
            description,
            services,
            base_price,
            discount_rate,
            final_price,
            start_date,
            end_date,
            conditions,
            package_type,
            category
        });

        await newPackage.save();
        return res.status(201).json({ message: 'Package created', package: newPackage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Pkg.find({}).populate('services');
        return res.status(200).json(packages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get a package by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const package1 = await Pkg.findById(id).populate('services');
        if (!package1) {
            return res.status(404).json({ message: 'Package1 not found' });
        }
        return res.status(200).json(package1);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Update a package
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            p_name,
            description,
            services,
            base_price,
            discount_rate,
            start_date,
            end_date,
            conditions,
            package_type,
            category,
            status
        } = req.body;

        // If services are being updated, validate them
        if (services) {
            const validServices = await Service.find({ '_id': { $in: services } });
            if (validServices.length !== services.length) {
                return res.status(400).json({ message: 'One or more service IDs are invalid' });
            }
        }

        // Calculate final price if base_price or discount_rate is updated
        const updateData = {
            p_name,
            description,
            services,
            base_price,
            discount_rate,
            start_date,
            end_date,
            conditions,
            package_type,
            category,
            status
        };

        if (base_price || discount_rate) {
            const existingPackage = await Pkg.findById(id);
            const newBasePrice = base_price || existingPackage.base_price;
            const newDiscountRate = discount_rate || existingPackage.discount_rate;
            updateData.final_price = newBasePrice * (1 - newDiscountRate / 100);
        }

        const updatedPackage = await Pkg.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate('services');

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).json({ message: 'Package updated', package: updatedPackage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete a package
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPackage = await Pkg.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        return res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Search packages
router.get('/search', async (req, res) => {
    try {
        const search = req.query.search;
        const results = await Pkg.find({
            $or: [
                { ID: { $regex: search, $options: "i" } },
                { p_name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { package_type: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        }).populate('services');
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Search failed' });
    }
});

export default router;