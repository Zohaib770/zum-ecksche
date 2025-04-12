const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const loginUser = async (req, res) => {
  console.log("===== ENTERLogin")
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful")
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };
