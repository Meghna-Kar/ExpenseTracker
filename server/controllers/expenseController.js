const db = require('../db/db');

// GET /api/expenses

exports.getExpenses = (req, res) => {
    const { user_id, category, startDate, endDate } = req.query;

    let query = 'SELECT * FROM Expenses WHERE 1=1';
    const params = [];

    if (user_id) {
        query += ' AND user_id = ?';
        params.push(user_id);
    }

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching filtered expenses:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};


// POST /api/expenses
exports.addExpense = (req, res) => {
    const { user_id, category, amount, date, description } = req.body;
    const query = 'INSERT INTO Expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user_id, category, amount, date, description], (err, result) => {
        if (err) {
            console.error('Error adding expense:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: result.insertId, message: 'Expense added successfully' });
    });
};

// PUT /api/expenses/:id
exports.updateExpense = (req, res) => {
    const { id } = req.params;
    const { user_id, category, amount, date, description } = req.body;
    const query = 'UPDATE Expenses SET user_id=?, category=?, amount=?, date=?, description=? WHERE id=?';
    db.query(query, [user_id, category, amount, date, description, id], (err) => {
        if (err) {
            console.error('Error updating expense:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Expense updated successfully' });
    });
};

// DELETE /api/expenses/:id
exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Expenses WHERE id=?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting expense:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Expense deleted successfully' });
    });
};
