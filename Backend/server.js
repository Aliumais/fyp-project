require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./database/db'); // Database connection
const User = require('./database/models/User'); // User model
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// User registration route
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
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            contactNumber,
        });

        // Save the new user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({
            message: 'User registered successfully!',
            user: { firstName, lastName, email, contactNumber },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;  // Using POST instead of GET since login should be POST
    
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the entered password with the stored password
        const isValidPassword = await user.comparePassword(password);  // Await the result of comparePassword

        if (isValidPassword) {
            res.status(200).json({ message: 'User logged in successfully', user: user });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password route
app.post('/user/forgot-password', async (req, res) => {
    console.log('Received forgot password request:', req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found with this email address' });
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        console.log('Generated reset token');
        
        await user.save();
        console.log('Saved user with reset token');

        // In a real application, you would send this token via email
        // For now, we'll return it in the response
        res.status(200).json({
            message: 'Password reset token generated successfully',
            resetToken: resetToken
        });
    } catch (error) {
        console.error('Error in forgot-password route:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Reset Password route
app.post('/user/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

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
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
        // Find user by email and update their details
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { firstName, lastName, contactNumber } }, // Update fields
            { new: true, runValidators: true } // Return updated user and apply validation
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
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
