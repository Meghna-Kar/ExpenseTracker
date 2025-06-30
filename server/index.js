const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');        
const categoryRoutes = require('./routes/categories');
const statsRoutes = require('./routes/statistics');

app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);               
app.use('/api/categories', categoryRoutes);
app.use('/api/statistics', statsRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
