const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Your Mongoose User model
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "16f89b44104d7f7a441275826ba8c447fbc9b10f881133b971622354581c93d8e28f19babd3f4144d0ce4cd0762c8748057f4bf2fa6ef6f017bad5738572d21a";

exports.login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email or username and password required' });
    }

    // Find user by email OR username (email is actually email or username here)
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for user:', user.username);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone || ''
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
