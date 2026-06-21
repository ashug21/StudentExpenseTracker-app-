const pool = require("../db");

const addUserExpense = async (req, res) => {
  const { expenseName, amount, category } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "UnAuthorized" });
    }

    const user_id = req.user.id;

    const result = await pool.query(
      `Insert into expenses(user_id , expenseName , amount , category) Values ($1, $2, $3, $4) Returning *`,
      [user_id, expenseName, amount, category]
    );

    return res
      .status(200)
      .json({ message: "Expense Added Successfully", expense: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const getUserExpenses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not Authenticated",
      });
    }

    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1",
      [user_id]
    );

    return res.status(200).json({
      expenses: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addUserExpense,
  getUserExpenses,
};
