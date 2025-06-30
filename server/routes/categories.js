const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

//List all categories
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

module.exports = router;
