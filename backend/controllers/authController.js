const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const loginUser = async (req, res) => {
  console.log("===== ENTERLogin");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Erstelle ein JWT-Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Das Token läuft nach 1 Tag ab
    );

    console.log("Login successful");
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };
