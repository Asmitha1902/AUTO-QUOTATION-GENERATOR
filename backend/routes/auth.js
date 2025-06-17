const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "16f89b44104d7f7a441275826ba8c447fbc9b10f881133b971622354581c93d8e28f19babd3f4144d0ce4cd0762c8748057f4bf2fa6ef6f017bad5738572d21a";

router.post('/login', async (req, res) => {
  const { email, password } = req.body; // email can be email or username

  try {
    // Try finding by email OR username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token }); // Frontend expects this!
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
