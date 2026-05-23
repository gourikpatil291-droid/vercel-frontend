const pool = require('../config/db');

exports.getPendingUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, mobile, employee_id, address, role, status, created_at FROM users WHERE status = "pending"');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: `User status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, mobile, employee_id, address, role, status, created_at FROM users');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
