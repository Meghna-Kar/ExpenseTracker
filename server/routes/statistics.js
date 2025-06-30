const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 1. Top 3 spending days
router.get('/top-days/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT DATE(date) AS spendDate, SUM(amount) AS total_spent
        FROM Expenses
        WHERE user_id = ?
        GROUP BY spendDate
        ORDER BY total_spent DESC
        LIMIT 3
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching top days:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ data: results });
    });
});

// 2. Monthly percentage change
router.get('/monthly-change/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            SUM(amount) AS total
        FROM Expenses
        WHERE user_id = ?
        GROUP BY month
        ORDER BY month DESC
        LIMIT 2
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching monthly change:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length < 2) return res.json({ data: { percentageChange: 0 } });

        const current = results[0].total;
        const previous = results[1].total;
        const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

        res.json({ data: { percentageChange: parseFloat(change.toFixed(2)) } });
    });
});

// 3. Predicted next month expenditure
router.get('/predict-next-month/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            SUM(amount) AS total
        FROM Expenses
        WHERE user_id = ?
        GROUP BY month
        ORDER BY month DESC
        LIMIT 3
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error predicting expenditure:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) return res.json({ data: { predicted: 0.0 } });

        const totalSum = results.reduce((sum, row) => sum + parseFloat(row.total), 0);
        const avg = totalSum / results.length;
        res.json({ data: { predicted: parseFloat(avg.toFixed(2)) } });
    });
});

module.exports = router;
