const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { addUserExpense , getUserExpenses ,setUserIncome , getUserIncome , deleteUserExpense ,countUserExpenses} = require("../controllers/expenseController");

router.post("/add", verifyToken, addUserExpense);
router.get("/user", verifyToken, getUserExpenses);
router.post("/set-income", verifyToken, setUserIncome);
router.get("/income", verifyToken, getUserIncome);
router.delete("/delete/:id", verifyToken, deleteUserExpense);

router.get("/count", verifyToken, countUserExpenses);

module.exports = router;