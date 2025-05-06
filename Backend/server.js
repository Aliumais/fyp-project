require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./database/db'); // Database connection
const User = require('./database/models/User'); // User model
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// User registration route with OTP and token generation
app.post('/user/register', async (req, res) => {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !contactNumber) {
        return res.status(400).json({ error: 'All fields (firstName, lastName, email, password, contactNumber) are required.' });
    }

    // Validate contact number format
    const contactNumberRegex = /^[0-9]{10,15}$/;
    if (!contactNumber.match(contactNumberRegex)) {
        return res.status(400).json({ error: 'Contact number must be between 10 and 15 digits.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ error: 'Email already in use.' });
            } else {
                // Delete unverified user to allow re-registration
                await User.deleteOne({ email });
            }
        }

        // Generate 6-digit OTP as a string
        const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenHashed = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // Create a new user with OTP and token
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            contactNumber,
            otp,
            otpExpires,
            verificationToken: verificationTokenHashed,
            verificationTokenExpires: otpExpires,
            isVerified: false // User is not verified until OTP is confirmed
        });

        // Save the new user to the database
        await newUser.save();

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options with aesthetic HTML template for verification link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Account',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .header { background: #007bff; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                        .content { padding: 20px; }
                        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
                        .button:hover { background: #0056b3; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Verify Your Account</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${firstName},</p>
                            <p>Thank you for registering! Please click the button below to verify your account:</p>
                            <a href="http://localhost:${PORT}/verify-otp/${verificationToken}" class="button">Verify Account</a>
                            <p>This link will expire in 10 minutes. If you did not request this, please ignore this email or contact our support team.</p>
                            <p> Otp is ${otp}</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send verification email
        await transporter.sendMail(mailOptions);

        // Send response indicating verification link has been sent
        res.status(201).json({
            message: 'Verification link sent to your email. Please verify to complete registration.',
            user: { firstName, lastName, email, contactNumber }
        });
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Resend OTP route
app.post('/user/resend-otp', async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified.' });
        }

        // Generate new 6-digit OTP as a string
        const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenHashed = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // Update user with new OTP and token
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.verificationToken = verificationTokenHashed;
        user.verificationTokenExpires = otpExpires;
        await user.save();

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options with aesthetic HTML template for verification link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Account - New OTP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .header { background: #007bff; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                        .content { padding: 20px; }
                        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
                        .button:hover { background: #0056b3; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Verify Your Account</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${user.firstName},</p>
                            <p>We have sent you a new verification link. Please click the button below to verify your account:</p>
                            <a href="http://localhost:${PORT}/verify-otp/${verificationToken}" class="button">Verify Account</a>
                            <p>This link will expire in 10 minutes. If you did not request this, please ignore this email or contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send verification email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'New verification link sent to your email.'
        });
    } catch (error) {
        console.error('Error in resend-otp route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Serve OTP Verification HTML Form
app.get('/verify-otp/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Log token for debugging
        console.log('Received verification token:', token);

        // Verify token validity
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        console.log('Hashed token:', hashedToken);

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('No user found or token expired');
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
                        .header { background: #dc3545; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Error</h2>
                        </div>
                        <p>Invalid or expired verification token. Please request a new verification link.</p>
                        <p><a href="/resend-otp">Request a new link</a></p>
                    </div>
                </body>
                </html>
            `);
        }

        if (user.isVerified) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
                        .header { background: #28a745; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Already Verified</h2>
                        </div>
                        <p>Your account is already verified. You can <a href="/login">log in</a> now.</p>
                    </div>
                </body>
                </html>
            `);
        }

        // Serve HTML form for OTP verification
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Verify OTP</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { background: #007bff; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    .content { padding: 20px; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; font-weight: bold; }
                    input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                    .button { display: inline-block; padding: 10px 20px; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; border: none; cursor: pointer; }
                    .button:hover { background: #0056b3; }
                    .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    .error { color: #dc3545; font-size: 14px; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Verify Your Account</h2>
                    </div>
                    <div class="content">
                        <form id="otpForm" action="/user/verify-otp" method="POST">
                            <div class="form-group">
                                <label for="otp">Enter OTP</label>
                                <input type="text" id="otp" name="otp" required>
                                <div id="otpError" class="error"></div>
                            </div>
                            <input type="hidden" name="token" value="${token}">
                            <button type="submit" class="button">Verify OTP</button>
                        </form>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
                <script>
                    document.getElementById('otpForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const otpInput = document.getElementById('otp').value.trim(); // Trim whitespace
                        const otpError = document.getElementById('otpError');
                        const otpRegex = /^\d{6}$/;

                        console.log('Entered OTP:', otpInput); // Debug log

                        // if (!otpRegex.test(otpInput)) {
                        //     otpError.textContent = 'OTP must be a 6-digit number';
                        //     return;
                        // }

                        const formData = {
                            token: '${token}',
                            otp: otpInput
                        };

                        try {
                            const response = await fetch('/user/verify-otp', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(formData)
                            });

                            const result = await response.json();
                            if (response.ok) {
                                alert('OTP verified successfully! Registration complete.');
                                window.location.href = '/login'; // Redirect to login page or another page
                            } else {
                                otpError.textContent = result.error || 'Failed to verify OTP';
                            }
                        } catch (error) {
                            otpError.textContent = 'An error occurred. Please try again later.';
                        }
                    });
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error in verify-otp form route:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
                    .header { background: #dc3545; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Server Error</h2>
                    </div>
                    <p>An error occurred. Please try again later.</p>
                </div>
            </body>
            </html>
        `);
    }
});

// OTP verification route
app.post('/user/verify-otp', async (req, res) => {
    const { token, otp } = req.body;

    // Validate input
    if (!token || !otp) {
        return res.status(400).json({ error: 'Token and OTP are required.' });
    }

    // Trim OTP and validate format
    const trimmedOtp = otp.trim();
    console.log('Received OTP:', trimmedOtp); // Debug log

    const otpRegex = /^\d{6}$/;
    if (!trimmedOtp.match(otpRegex)) {
        return res.status(400).json({ error: 'OTP must be a 6-digit number.' });
    }

    try {
        // Find user by verification token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified.' });
        }

        // Log stored OTP for debugging
        console.log('Stored OTP:', user.otp);
        console.log('Stored OTP type:', typeof user.otp);
        console.log('Received OTP type:', typeof trimmedOtp);

        // Check if OTP is valid and not expired
        if (user.otp !== trimmedOtp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        // Mark user as verified and clear OTP and token fields
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Account Verification Successful',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .header { background: #28a745; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                        .content { padding: 20px; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Account Verification Successful</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${user.firstName},</p>
                            <p>Your account has been successfully verified. You can now log in to your account.</p>
                            <p>If you did not initiate this, please contact our support team immediately.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'OTP verified successfully. Registration complete!',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                contactNumber: user.contactNumber
            }
        });
    } catch (error) {
        console.error('Error in verify-otp route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// User login route
app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: 'Please verify your email using the link sent to you.' });
        }

        // Compare the entered password with the stored password
        const isValidPassword = await user.comparePassword(password);

        if (isValidPassword) {
            res.status(200).json({ message: 'User logged in successfully', user: user });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password route
app.post('/user/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found with this email address' });
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options with aesthetic HTML template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .header { background: #007bff; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                        .content { padding: 20px; }
                        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
                        .button:hover { background: #0056b3; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Password Reset Request</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${user.firstName},</p>
                            <p>We received a request to reset your password. Click the button below to reset it:</p>
                            <a href="http://localhost:${PORT}/reset-password/${resetToken}" class="button">Reset Password</a>
                            <p>This link will expire in 1 hour for security reasons.</p>
                            <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Password reset email sent successfully'
        });
    } catch (error) {
        console.error('Error in forgot-password route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Serve Reset Password HTML Form
app.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verify token validity
        const user = await User.findOne({
            resetPasswordToken: crypto
                .createHash('sha256')
                .update(token)
                .digest('hex'),
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
                        .header { background: #dc3545; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Error</h2>
                        </div>
                        <p>Invalid or expired reset token. Please request a new password reset link.</p>
                    </div>
                </body>
                </html>
            `);
        }

        // Serve HTML form for password reset
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reset Password</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { background: #007bff; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    .content { padding: 20px; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; font-weight: bold; }
                    input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                    .button { display: inline-block; padding: 10px 20px; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; border: none; cursor: pointer; }
                    .button:hover { background: #0056b3; }
                    .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    .error { color: #dc3545; font-size: 14px; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Reset Your Password</h2>
                    </div>
                    <div class="content">
                        <form id="resetForm" action="/user/reset-password" method="POST">
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" name="newPassword" required>
                                <div id="passwordError" class="error"></div>
                            </div>
                            <input type="hidden" name="token" value="${token}">
                            <button type="submit" class="button">Reset Password</button>
                        </form>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
                <script>
                    document.getElementById('resetForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const newPassword = document.getElementById('newPassword').value;
                        const passwordError = document.getElementById('passwordError');
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;

                        if (!passwordRegex.test(newPassword)) {
                            passwordError.textContent = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
                            return;
                        }

                        const formData = {
                            token: '${token}',
                            newPassword: newPassword
                        };

                        try {
                            const response = await fetch('/user/reset-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(formData)
                            });

                            const result = await response.json();
                            if (response.ok) {
                                alert('Password reset successful! You can now log in with your new password.');
                                window.location.href = '/login'; // Redirect to login page or another page
                            } else {
                                passwordError.textContent = result.error || 'Failed to reset password';
                            }
                        } catch (error) {
                            passwordError.textContent = 'An error occurred. Please try again later.';
                        }
                    });
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error in reset-password form route:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
                    .header { background: #dc3545; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Server Error</h2>
                    </div>
                    <p>An error occurred. Please try again later.</p>
                </div>
            </body>
            </html>
        `);
    }
});

// Reset Password API
app.post('/user/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword.match(passwordRegex)) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
        });
    }

    try {
        // Find user by reset token and check if it's expired
        const user = await User.findOne({
            resetPasswordToken: crypto
                .createHash('sha256')
                .update(token)
                .digest('hex'),
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Successful',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .header { background: #28a745; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                        .content { padding: 20px; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Password Reset Successful</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${user.firstName},</p>
                            <p>Your password has been successfully reset. You can now log in with your new password.</p>
                            <p>If you did not initiate this change, please contact our support team immediately.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: 'Password reset successful. A confirmation email has been sent.',
            user: { email: user.email, firstName: user.firstName }
        });
    } catch (error) {
        console.error('Error in reset-password route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Update User route
app.put('/user/update', async (req, res) => {
    const { email, firstName, lastName, contactNumber } = req.body;

    // Validate input
    if (!email || !firstName || !lastName || !contactNumber) {
        return res.status(400).json({ error: 'All fields (email, firstName, lastName, contactNumber) are required.' });
    }

    // Validate contact number format
    const contactNumberRegex = /^[0-9]{10,15}$/;
    if (!contactNumber.match(contactNumberRegex)) {
        return res.status(400).json({ error: 'Contact number must be between 10 and 15 digits.' });
    }

    try {
        // Find user and update their details
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { firstName, lastName, contactNumber } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error in update-user route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});