const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let transporter;

async function setupMailer() {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_real_email')) {
        console.log("Generating Ethereal test email account...");
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log("Ethereal test email ready! Check terminal for preview links when logging in.");
    } else {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
}
setupMailer();

exports.register = async (req, res) => {
    try {
        const { name, email, mobile, employee_id, address, role, password } = req.body;
        
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR mobile = ? OR employee_id = ?', [email, mobile, employee_id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists with given email, mobile, or employee ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const status = (role === 'Manager' || role === 'HO') ? 'approved' : 'pending';
        
        await pool.query(
            'INSERT INTO users (name, email, mobile, employee_id, address, role, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, mobile, employee_id, address, role, hashedPassword, status]
        );

        const message = status === 'approved' 
            ? 'Registration successful. You can now login.' 
            : 'Registration successful. Waiting for Manager approval.';

        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        if (user.status !== 'approved') {
            return res.status(403).json({ message: `Account is ${user.status}. Please contact Manager/HO.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
        
        await pool.query('INSERT INTO otp_codes (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expires_at]);
        
        // Send OTP via Email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'test@ethereal.email',
            to: email,
            subject: 'Your Login OTP for Nucleus Analytics',
            text: `Your OTP for login is: ${otp}. It will expire in 10 minutes.`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'OTP sent to your email.' });
            
            // If using Ethereal, log the preview URL to the terminal
            if (info.messageId && transporter.options.host === 'smtp.ethereal.email') {
                console.log("*************************************************");
                console.log("Preview your OTP Email here: %s", nodemailer.getTestMessageUrl(info));
                console.log("*************************************************");
            }
        } catch (mailErr) {
            console.error('Error sending email:', mailErr);
            // Fallback for development if email fails
            console.log(`Fallback mock OTP for ${email}: ${otp}`);
            res.status(500).json({ message: 'Failed to send OTP email. Please verify your email configuration in .env.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const [codes] = await pool.query('SELECT * FROM otp_codes WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [email, otp]);
        if (codes.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const [users] = await pool.query('SELECT id, name, email, role, status FROM users WHERE email = ?', [email]);
        const user = users[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
