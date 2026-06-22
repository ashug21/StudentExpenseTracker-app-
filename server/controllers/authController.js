const pool = require("../db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json({
      message: "User created",
      user: user.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await pool.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     if (user.rows.length === 0) {
//       return res.status(400).json({
//         message: "User not found",
//       });
//     }

//     if (user.rows[0].password !== password) {
//       return res.status(400).json({
//         message: "Invalid password",
//       });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: user.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.rows[0].password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  register,
  login,
};