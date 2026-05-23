const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { 
    submitInstallation, getInstallations,
    submitServiceReport, getServiceReports,
    submitClosureForm, getClosureForms,
    submitCustomerFeedback, getCustomerFeedbacks
} = require('../controllers/formController');

const router = express.Router();

router.use(protect);

// Installations
router.post('/installations', submitInstallation);
router.get('/installations', getInstallations);

// Service Reports
router.post('/service-reports', submitServiceReport);
router.get('/service-reports', getServiceReports);

// Closure Forms
router.post('/closure-forms', submitClosureForm);
router.get('/closure-forms', getClosureForms);

// Customer Feedbacks
router.post('/customer-feedbacks', submitCustomerFeedback);
router.get('/customer-feedbacks', getCustomerFeedbacks);

module.exports = router;
