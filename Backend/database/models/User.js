const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing and comparing passwords
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // First name is required
        trim: true, // Removes extra spaces
    },
    lastName: {
        type: String,
        required: true, // Last name is required
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/, // Basic regex for email validation
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    contactNumber: {
        type: String,
        required: true, // Contact number is required
        match: /^[0-9]{10,15}$/, // Basic validation for 10-15 digit numbers
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to the current date
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time to 1 hour
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    return resetToken;
};

// Method to compare the entered password with the hashed password in the database
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password); // Compares the candidate password with the hashed password
};

// Hash the password before saving it to the database (this runs when you save a new user or update an existing user)
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // If the password is modified (during registration or password change), hash it
        this.password = await bcrypt.hash(this.password, 10); // Hash the password with 10 salt rounds
    }
    next(); // Continue with the save process
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
