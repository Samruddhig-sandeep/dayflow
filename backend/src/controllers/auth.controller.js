const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const jwtConfig = require("../config/jwt");

// SIGNUP
exports.signup = async (req, res) => {
  console.log("🔥 SIGNUP HIT 🔥");
  console.log("SIGNUP BODY:", req.body);

  const { employeeId, email, password, role } = req.body;

  if (!employeeId || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (employee_id, email, password, role) VALUES (?, ?, ?, ?)",
      [employeeId, email, hashedPassword, role]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  console.log("🔥 LOGIN HIT 🔥");
  console.log("LOGIN BODY:", req.body);

  const { email, password, role } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      success: true,
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
