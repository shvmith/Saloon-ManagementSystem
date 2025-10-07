import express from 'express';
import { 
    createFeedback, 
    getAllFeedback, 
    getOneFeedback, 
    updateFeedback, 
    deleteFeedback,
    updateFeedbackStatus
} from '../controllers/feedbackController.js';

const router = express.Router();

// Base routes
router.post('/', createFeedback);
router.get('/', getAllFeedback);
router.get('/:id', getOneFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

// Status update routes - make sure this is defined before the export
router.put('/status/:id', updateFeedbackStatus);
router.patch('/status/:id', updateFeedbackStatus);

export default router;