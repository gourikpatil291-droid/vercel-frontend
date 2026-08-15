const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

async function getTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER || 'gourikpatil291@gmail.com',
            pass: process.env.EMAIL_PASS || 'wggewgwddwfxbaqb'
        }
    });
}

exports.register = async (req, res) => {
    try {
        const { name, email, mobile, employee_id, address, role, password } = req.body;

        // Check if user exists
        const existing = await User.findOne({
            $or: [{ email }, { mobile }, { employee_id }]
        });
        if (existing) {
            return res.status(400).json({ message: 'User already exists with given email, mobile, or employee ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const status = (role === 'Manager' || role === 'HO') ? 'approved' : 'pending';

        await User.create({
            name,
            email,
            mobile,
            employee_id,
            address,
            role,
            password: hashedPassword,
            status
        });

        const message = status === 'approved' 
            ? 'Registration successful. You can now login.' 
            : 'Registration successful. Waiting for Manager approval.';

        res.status(201).json({ message });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// STEP 1: LOGIN WITH PASSWORD -> TRIGGERS OTP EMAIL TO USER
exports.login = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: loginId }, { mobile: loginId }, { employee_id: loginId }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'pending') {
            return res.status(400).json({ message: 'Your account is pending approval by Manager.' });
        }
        if (user.status === 'rejected') {
            return res.status(400).json({ message: 'Your account registration was rejected.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await Otp.create({
            email: user.email,
            otp,
            expires_at: expiresAt
        });

        const formattedOtp = otp.split('').join(' ');

        const htmlTemplate = `
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, sans-serif; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <div style="background-color: #5c67f6; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">SERVICE MANAGEMENT SYSTEM</h1>
            </div>
            <div style="padding: 32px 28px;">
                <h2 style="color: #1f2937; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">Your OTP Code</h2>
                <p style="color: #4b5563; font-size: 15px; margin-bottom: 12px;">Hello ${user.name || 'User'},</p>
                <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">Your One-Time Password (OTP) for login is:</p>
                
                <div style="background-color: #f0f4ff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                    <span style="color: #5c67f6; font-size: 32px; font-weight: 800; letter-spacing: 8px; font-family: monospace;">${formattedOtp}</span>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">This code will expire in 10 minutes. Do not share it with anyone.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                <p style="color: #6b7280; font-size: 13px; font-weight: 600; margin: 0 0 6px 0;">Service Management System Team</p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated notification. Please do not reply directly to this mail.</p>
            </div>
        </div>
        `;

        try {
            const transporter = await getTransporter();
            await transporter.sendMail({
                from: '"Service Management System" <gourikpatil291@gmail.com>',
                to: user.email,
                subject: 'Your Login OTP Code',
                text: `Hello ${user.name}, Your OTP for login is: ${otp}. It will expire in 10 minutes.`,
                html: htmlTemplate
            });
            console.log(`OTP Email sent successfully to ${user.email}`);
            return res.status(200).json({ 
                message: `OTP sent to your email (${user.email}). Please enter it to complete login.`,
                email: user.email
            });
        } catch (mailErr) {
            console.error('Email send failed:', mailErr);
            return res.status(200).json({
                message: 'Failed to send Email. OTP mock logged to console.',
                devOtp: otp
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.sendOTP = async (req, res) => {
    return exports.login(req, res);
};

// STEP 2: VERIFY OTP -> ISSUES JWT TOKEN & LOGS IN
exports.verifyOTP = async (req, res) => {
    try {
        const { loginId, otp } = req.body;

        const user = await User.findOne({
            $or: [{ email: loginId }, { mobile: loginId }, { employee_id: loginId }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const validOtp = await Otp.findOne({
            email: user.email,
            otp,
            expires_at: { $gt: new Date() }
        }).sort({ created_at: -1 });

        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};
