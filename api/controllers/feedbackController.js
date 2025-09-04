import mongoose from 'mongoose'; 
import Feedback from '../models/feedbackModel.js';
import { Service } from '../models/Service.js';

const validateFields = (req, res, next) => {
    const requiredFields = [
        "user_id",
        
        "serviceid",
        "employee",
        "date_of_service",
        "message",
        "star_rating",
    ];

    // Check if all required fields are present
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Missing required field: ${field}` });
        }
    }

    // Validate email format
    if (!req.body.email.match(/^\S+@\S+\.\S+$/)) {
        return res.status(400).send({ message: "Please provide a valid email address" });
    }

    // Validate phone number format
    if (!req.body.phone_number.match(/^\d{10}$/)) {
        return res.status(400).send({ message: "Please provide a valid 10-digit phone number" });
    }

    // Convert date_of_service to a Date object
    const parseDate = req.body.date_of_service ? new Date(req.body.date_of_service) : undefined;
    if (!parseDate || isNaN(parseDate.getTime())) {
        return res.status(400).send({ message: "Please provide a valid date for date_of_service" });
    }

    // Make data available in request
    req.parseDate = parseDate;
    next();
};

// Create new feedback
export const createFeedback = async (req, res) => {
    try {
        console.log('Received feedback request body:', req.body); // Log entire request body
        
        const {
            user_id,
            serviceID,
            message,
            date_of_service,
            star_rating,
        } = req.body;

        // Explicitly define the new feedback object with status
        const newFeedback = {
            user_id,
            serviceID,
            date_of_service,
            message,
            star_rating,
            status: 'pending', // Explicit default status
        };

        console.log('Creating feedback with data:', newFeedback); // Log what we're trying to save

        // Save new feedback to the database
        const feedback = await Feedback.create(newFeedback);
        if (!feedback) {
            return res.status(500).json({ message: "Failed to create feedback" });
        }
        
        console.log('Feedback created successfully:', feedback); // Log created feedback
        return res.status(201).json(feedback);
    } catch (error) {
        console.error('Error creating feedback:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Update feedback status
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'approved', 'declined'].includes(status)) {
            return res.status(400).send({ message: "Invalid status value" });
        }
        
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }
        
        feedback.status = status;
        await feedback.save();
        
        res.status(200).send({ 
            message: `Feedback status updated to ${status}`,
            feedback
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Get route for feedback based on search criteria
// router.get("/feedback", async (req, res) => {
//     try {
//         const { search = "" } = req.query;
//         const query = {
//             $or: [
//                 { UserName: { $regex: search, $options: "i" } },
//                 { name: { $regex: search, $options: "i" } },
//                 { email: { $regex: search, $options: "i" } },
//                 { phone_number: { $regex: search, $options: "i" } },
//                 { employee: { $regex: search, $options: "i" } },
//                 { date_of_service: { $regex: search, $options: "i" } },
//                 { message: { $regex: search, $options: "i" } },
//                 { star_rating: { $regex: search, $options: "i" } },
//             ],
//         };
//         const feedback = await Feedback.find(query);
//         res.status(200).json({ count: feedback.length, data: feedback });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// });


// Update feedback by ID

export const updateFeedback = async  (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        await Feedback.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).send({ message: "Feedback updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Get all feedback

export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find();
        console.log(`Found ${feedback.length} feedback items`);
        
        // Fetch service details for each feedback
        const feedbackWithServices = await Promise.all(
            feedback.map(async (item) => {
                const feedbackObj = item.toObject();
                
                if (item.serviceID) {
                    // console.log(`Looking up service with ID: ${item.serviceID}`);
                    try {
                        // First try direct lookup by service_ID
                        let service = await Service.findOne({ service_ID: item.serviceID });
                        
                        // If not found, try again with 'service' prefix if it doesn't have one
                        if (!service && !item.serviceID.startsWith('service')) {
                            service = await Service.findOne({ service_ID: `service${item.serviceID}` });
                        }
                        
                        if (service) {
                            console.log(`Found service: ${service.category} - ${service.subCategory}`);
                            feedbackObj.serviceDetails = {
                                category: service.category,
                                subCategory: service.subCategory
                            };
                        } else {
                            // Try looking up by MongoDB _id as fallback
                            service = await Service.findById(item.serviceID);
                            if (service) {
                                console.log(`Found service by _id: ${service.category} - ${service.subCategory}`);
                                feedbackObj.serviceDetails = {
                                    category: service.category,
                                    subCategory: service.subCategory
                                };
                            } else {
                                console.log(`Service not found for ID: ${item.serviceID}`);
                            }
                        }
                    } catch (err) {
                        console.error(`Error fetching service for feedback ${item._id}:`, err);
                    }
                }
                
                return feedbackObj;
            })
        );
        
        res.status(200).json(feedbackWithServices);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Delete feedback by ID

export const deleteFeedback = async (req, res) => {

    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        await Feedback.findByIdAndDelete(id);
        res.status(200).send({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// get one feedback by ID

export const getOneFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        const feedbackObj = feedback.toObject();
        
        if (feedback.serviceID) {
            try {
                // Convert serviceID to string to ensure proper comparison
                const service = await Service.findOne({ service_ID: String(feedback.serviceID) });
                if (service) {
                    feedbackObj.serviceDetails = {
                        category: service.category,
                        subCategory: service.subCategory
                    };
                } else {
                    console.log(`Service not found for ID: ${feedback.serviceID}`);
                }
            } catch (err) {
                console.error(`Error fetching service for feedback ${feedback._id}:`, err);
            }
        }

        res.status(200).send(feedbackObj);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};