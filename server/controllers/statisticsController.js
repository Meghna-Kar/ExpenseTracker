const db = require('../db/db'); 

exports.getUserStatistics = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get Top 3 Spending Days
    const [topDays] = await db.query(`
      SELECT DATE(date) AS spendDate, SUM(amount) AS total
      FROM Expenses
      WHERE user_id = ?
      GROUP BY spendDate
      ORDER BY total DESC
      LIMIT 3
    `, [userId]);

    // Get monthly totals (latest 2 months)
    const [monthlyTotals] = await db.query(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month,
        SUM(amount) AS total
      FROM Expenses
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `, [userId]);

    let monthlyChange = null;
    if (monthlyTotals.length === 2) {
      const current = monthlyTotals[0].total;
      const previous = monthlyTotals[1].total;
      monthlyChange = {
        currentMonth: current,
        previousMonth: previous,
        changePercent: ((current - previous) / previous * 100).toFixed(2)
      };
    }

    // Get last 3 months' total for prediction
    const [last3Months] = await db.query(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month,
        SUM(amount) AS total
      FROM Expenses
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
      LIMIT 3
    `, [userId]);

    const averageSpending = last3Months.length
      ? (last3Months.reduce((sum, row) => sum + row.total, 0) / last3Months.length).toFixed(2)
      : 0;

    res.json({
      topSpendingDays: topDays,
      monthlyChange: monthlyChange || { currentMonth: 0, previousMonth: 0, changePercent: null },
      nextMonthPrediction: averageSpending
    });

  } catch (err) {
    console.error('Error in getUserStatistics:', err);
    res.status(500).json({ message: 'Failed to fetch user statistics.' });
  }
};
