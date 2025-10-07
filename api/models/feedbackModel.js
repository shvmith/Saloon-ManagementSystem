import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema(
    {
    user_id: {
        type: String,
    },
    serviceID: { 
        type:String,
        
    },
    date_of_service: {
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    star_rating:{
        type:Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
},
{ timestamps: true }
    
);
const   Feedback = mongoose.model('Feedback' ,feedbackSchema);
export default Feedback;