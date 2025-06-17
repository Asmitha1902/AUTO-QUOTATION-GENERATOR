const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user exists with same email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email or username already exists' });
    }

    // Create new user instance - password hashing should be handled in User model pre-save middleware
    const newUser = new User({ name, username, email, phone, password });
    const savedUser = await newUser.save();

    // Respond without password
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        phone: savedUser.phone,
      }
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

// GET /api/users - Get all users (exclude passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

// GET /api/users/:userId - Get user by ID (exclude password)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

// PUT /api/users/:userId - Update user info, hash password if changed
router.put('/:userId', async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (password) {
      // Fetch user, update fields & password (hashing done in model)
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.name = name !== undefined ? name : user.name;
      user.username = username !== undefined ? username : user.username;
      user.email = email !== undefined ? email : user.email;
      user.phone = phone !== undefined ? phone : user.phone;
      user.password = password; // triggers hashing on save

      const updatedUser = await user.save();
      const userObj = updatedUser.toObject();
      delete userObj.password;

      return res.json({ success: true, message: 'User updated successfully', user: userObj });
    } else {
      // Update without password change
      const updateData = { name, username, email, phone };
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        updateData,
        { new: true, select: '-password' }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, message: 'User updated successfully', user: updatedUser });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

// DELETE /api/users/:userId - Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

module.exports = router;
