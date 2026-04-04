const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Login & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  // req.user is already populated by 'protect' middleware
  res.json(req.user);
};

module.exports = { login, getMe };