const Installation = require('../models/Installation');
const ServiceReport = require('../models/ServiceReport');
const ClosureForm = require('../models/ClosureForm');
const CustomerReview = require('../models/CustomerReview');

// Installation Forms
exports.submitInstallation = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id };
        for (let key in data) {
            if (data[key] === '') data[key] = null;
        }
        await Installation.create(data);
        res.status(201).json({ message: 'Installation form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getInstallations = async (req, res) => {
    try {
        const query = req.user.role === 'SE' ? { user_id: req.user.id } : {};
        const rows = await Installation.find(query).sort({ created_at: -1 });
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Service Reports
exports.submitServiceReport = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id };
        for (let key in data) {
            if (data[key] === '') data[key] = null;
        }
        await ServiceReport.create(data);
        res.status(201).json({ message: 'Service report submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getServiceReports = async (req, res) => {
    try {
        const query = req.user.role === 'SE' ? { user_id: req.user.id } : {};
        const rows = await ServiceReport.find(query).sort({ created_at: -1 });
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Closure Forms
exports.submitClosureForm = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id };
        for (let key in data) {
            if (data[key] === '') data[key] = null;
        }
        await ClosureForm.create(data);
        res.status(201).json({ message: 'Closure form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getClosureForms = async (req, res) => {
    try {
        const query = req.user.role === 'SE' ? { user_id: req.user.id } : {};
        const rows = await ClosureForm.find(query).sort({ created_at: -1 });
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Customer Feedbacks
exports.submitCustomerFeedback = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id };
        for (let key in data) {
            if (data[key] === '') data[key] = null;
        }
        await CustomerReview.create(data);
        res.status(201).json({ message: 'Customer feedback submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCustomerFeedbacks = async (req, res) => {
    try {
        const query = req.user.role === 'SE' ? { user_id: req.user.id } : {};
        const rows = await CustomerReview.find(query).sort({ created_at: -1 });
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch all forms for a specific user (For Manager/HO preview)
exports.getUserForms = async (req, res) => {
    try {
        const { userId } = req.params;
        const installations = await Installation.find({ user_id: userId });
        const serviceReports = await ServiceReport.find({ user_id: userId });
        const customerFeedbacks = await CustomerReview.find({ user_id: userId });

        const combined = [
            ...installations.map(f => ({ ...f.toObject(), _type: 'Acceptance Certificate' })),
            ...serviceReports.map(f => ({ ...f.toObject(), _type: 'Service Report' })),
            ...customerFeedbacks.map(f => ({ ...f.toObject(), _type: 'Customer Feedback' }))
        ].sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

        res.status(200).json(combined);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user forms' });
    }
};
