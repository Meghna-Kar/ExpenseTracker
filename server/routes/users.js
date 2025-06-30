const express = require('express');
const router = express.Router();
const db = require('../db/db');
 

// GET /api/users
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

module.exports = router;
