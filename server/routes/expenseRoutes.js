const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { addUserExpense , getUserExpenses} = require("../controllers/expenseController");

router.post("/add", verifyToken, addUserExpense);
router.get("/user", verifyToken, getUserExpenses);

module.exports = router;