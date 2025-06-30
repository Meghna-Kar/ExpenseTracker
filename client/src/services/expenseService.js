import api from './api';

// Expense service functions
export const expenseService = {
  // Get all expenses with optional filters
  async getExpenses(filters = {}) {
    try {
      const response = await api.getExpenses(filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  // Add new expense
  async addExpense(expense) {
    try {
      // Validate expense data
      const validatedExpense = this.validateExpense(expense);
      const response = await api.addExpense(validatedExpense);
      return response.data;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  // Editing expense
  async updateExpense(id, expense) {
    try {
      const validatedExpense = this.validateExpense(expense);
      const response = await api.updateExpense(id, validatedExpense);
      return response.data;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  // Delete expense
  async deleteExpense(id) {
    try {
      const response = await api.deleteExpense(id);
      return response.data;
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // Get users
  async getUsers() {
    try {
      const response = await api.getUsers();
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await api.getCategories();
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Statistics
  async getUserTopDays(userId) {
    try {
      const response = await api.getUserTopDays(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching user top days:", error);
      throw error;
    }
  },

  async getMonthlyChangePercentage(userId) {
    try {
      const response = await api.getMonthlyChangePercentage(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly change:", error);
      throw error;
    }
  },

  async predictNextMonth(userId) {
    try {
      const response = await api.predictNextMonth(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching prediction:", error);
      throw error;
    }
  },

  // Validation
  validateExpense(expense) {
    const errors = [];

    if (!expense.user_id) {
      errors.push("User is required");
    }

    if (!expense.category || expense.category.trim() === "") {
      errors.push("Category is required");
    }

    if (
      !expense.amount ||
      isNaN(expense.amount) ||
      parseFloat(expense.amount) <= 0
    ) {
      errors.push("Amount must be a positive number");
    }

    if (!expense.date) {
      errors.push("Date is required");
    } else {
      const date = new Date(expense.date);
      if (isNaN(date.getTime())) {
        errors.push("Invalid date format");
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return {
      user_id: parseInt(expense.user_id),
      category: expense.category.trim(),
      amount: parseFloat(expense.amount),
      date: expense.date,
      description: expense.description ? expense.description.trim() : "",
    };
  },

  // Utility functions
  calculateTotalExpenses(expenses) {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },

  groupExpensesByCategory(expenses) {
    return expenses.reduce((groups, expense) => {
      const category = expense.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(expense);
      return groups;
    }, {});
  },

  groupExpensesByUser(expenses) {
    return expenses.reduce((groups, expense) => {
      const userId = expense.user_id;
      if (!groups[userId]) {
        groups[userId] = [];
      }
      groups[userId].push(expense);
      return groups;
    }, {});
  },

  filterExpensesByDateRange(expenses, startDate, endDate) {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  },
};
