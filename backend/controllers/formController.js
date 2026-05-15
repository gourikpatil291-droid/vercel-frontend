const pool = require('../config/db');

// Installation Forms
exports.submitInstallation = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id };
        for (let key in data) {
            if (data[key] === '') data[key] = null;
        }
        const query = 'INSERT INTO installations SET ?';
        await pool.query(query, data);
        res.status(201).json({ message: 'Installation form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getInstallations = async (req, res) => {
    try {
        let query = 'SELECT * FROM installations';
        let params = [];
        if (req.user.role === 'SE') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }
        const [rows] = await pool.query(query, params);
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
        const query = 'INSERT INTO service_reports SET ?';
        await pool.query(query, data);
        res.status(201).json({ message: 'Service report submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getServiceReports = async (req, res) => {
    try {
        let query = 'SELECT * FROM service_reports';
        let params = [];
        if (req.user.role === 'SE') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }
        const [rows] = await pool.query(query, params);
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
        const query = 'INSERT INTO closure_forms SET ?';
        await pool.query(query, data);
        res.status(201).json({ message: 'Closure form submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getClosureForms = async (req, res) => {
    try {
        let query = 'SELECT * FROM closure_forms';
        let params = [];
        if (req.user.role === 'SE') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }
        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
