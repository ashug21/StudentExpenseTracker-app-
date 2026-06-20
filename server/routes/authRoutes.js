const express = require("express");
const router = express.Router();

const {register,login} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/", verifyToken, (req, res) => {

    res.json({
  
      message: "Authorized",
  
      user: req.user,
  
    });
  
  });

module.exports = router;