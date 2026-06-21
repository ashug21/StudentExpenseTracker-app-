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


const setUserIncome = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
  
      const { income } = req.body;
      const user_id = req.user.id;
  
      const existingIncome = await pool.query(
        "SELECT * FROM setIncome WHERE user_id = $1",
        [user_id]
      );
  
      if (existingIncome.rows.length > 0) {
        const updatedIncome = await pool.query(
          `UPDATE setIncome
           SET income = $1
           WHERE user_id = $2
           RETURNING *`,
          [income, user_id]
        );
  
        return res.status(200).json({
          message: "Income Updated Successfully",
          income: updatedIncome.rows[0],
        });
      }
  
      const newIncome = await pool.query(
        `INSERT INTO setIncome(user_id, income)
         VALUES($1, $2)
         RETURNING *`,
        [user_id, income]
      );
  
      return res.status(201).json({
        message: "Income Added Successfully",
        income: newIncome.rows[0],
      });
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };

  const getUserIncome = async(req,res) => {
    
    const user_id = req.user.id;

  const result = await pool.query(
    "SELECT income FROM setIncome WHERE user_id = $1",
    [user_id]
  );

  if (result.rows.length === 0) {
    return res.status(200).json({
      income: 0,
    });
  }
  return res.status(200).json({
    income: result.rows[0].income,
  });
  }

module.exports = {
  addUserExpense,
  getUserExpenses,
  setUserIncome,
  getUserIncome
};

