import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpenseFilters from "@/components/expense/ExpenseFilters";
import ExpenseList from "@/components/expense/ExpenseList";
import StatisticsCards from "@/components/expense/StatisticsCards";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { expenseService } from "@/services/expenseService";
import {
  Wallet,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [overview, setOverview] = useState({
    totalExpenses: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("1"); // For StatisticsCards

  // Load users and categories 
  const loadInitialData = async () => {
    try {
      const [usersData, categoriesData] = await Promise.all([
        expenseService.getUsers(),
        expenseService.getCategories(),
      ]);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load users or categories:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load expenses
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const expensesData = await expenseService.getExpenses(filters);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Overview
  useEffect(() => {
    setOverview({
      totalExpenses: expenses.length,
      totalCategories: categories.length,
      totalUsers: users.length,
    });
  }, [expenses, categories, users]);

  // Filters
  const handleFiltersChange = (newFilters) => {
    const cleanFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value && value !== "all") acc[key] = value;
      return acc;
    }, {});
    setFilters(cleanFilters);
  };

  const handleExpenseAdded = useCallback(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleEditExpense = useCallback((expense) => {
    setEditingExpense(expense);
  }, []);

  const handleEditComplete = useCallback(() => {
    setEditingExpense(null);
    loadExpenses();
  }, [loadExpenses]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Expense Dashboard</h1>
          <p className="text-gray-600">Track and manage your expenses with detailed insights</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                Total Expenses
              </CardTitle>
              <CardDescription>Total number of expense entries</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              {overview.totalExpenses}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Total Categories
              </CardTitle>
              <CardDescription>Different types of spending categories</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              {overview.totalCategories}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Total Users
              </CardTitle>
              <CardDescription>Active users being tracked</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              {overview.totalUsers}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ExpenseFilters onChange={handleFiltersChange} users={users} />

        {/* Form and Expense List */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1">
            <ExpenseForm
              users={users}
              categories={categories}
              onExpenseAdded={handleExpenseAdded}
              editingExpense={editingExpense}
              onEditComplete={handleEditComplete}
            />
          </div>

          <div className="xl:col-span-3">
            <ExpenseList
              expenses={expenses}
              loading={loading}
              onEditExpense={handleEditExpense}
              onDeleteComplete={loadExpenses}
            />
          </div>
        </div>

        {/* Statistics*/}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Advanced Statistics</h2>
          </div>

          {/* User Dropdown for Statistics */}
          <div className="w-64">
            <Label htmlFor="user" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Users className="w-4 h-4" /> Select User
            </Label>
            <Select value={selectedUserId} onValueChange={(value) => setSelectedUserId(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name} (ID: {user.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <StatisticsCards userId={selectedUserId} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
