import express from 'express';
import { Service } from '../models/Service.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    }
});

const uploads = multer({ storage: storage }).single('image');

// Serve static files from the uploads directory

// Middleware for validating required fields
const validateFields = (req, res, next) => {
    const requiredFields = [
        'category',
        'description',
        'duration',
        'price',
        'available',
        'subCategory'
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

// Create a new service
router.post("/", uploads, validateFields, async (req, res) => {
    try {
      const { category, description, duration, price, available, subCategory } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
  
      const newService = new Service({
        category,
        description,
        duration,
        price,
        available,
        subCategory,
        image,
      });
  
      await newService.save();
      return res.status(201).json({ message: "Service created", service: newService });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: error.message });
    }
  });
// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        return res.status(200).json(services);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get service by service_ID - moving this before the :id route to avoid path conflicts
router.get('/byServiceId/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        const foundService = await Service.findOne({ service_ID: serviceId });
        if (!foundService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.status(200).json(foundService);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get a service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundService = await Service.findById(id);
        if (!foundService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.status(200).json(foundService);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Update a service
router.put('/:id', uploads, async (req, res) => {
    try {
        const { id } = req.params;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const updatedData = {
            ...req.body,
            ...(image && { image })
        };

        const updatedService = await Service.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).send({ message: 'Service updated successfully', updatedService });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.status(200).send({ message: 'Service deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Search services
router.get('/searchservice', async (req, res) => {
    try {
        const search = req.query.search;
        const results = await Service.find({
            $or: [
                { service_ID: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { duration: { $regex: search, $options: "i" } },
                { price: { $regex: search, $options: "i" } },
                { available: { $regex: search, $options: "i" } },
                { subCategory: { $regex: search, $options: "i" } }
            ]
        });
        return res.json(results);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Search failed' });
    }
});

export default router;