import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpenseFilters from "@/components/expense/ExpenseFilters";
import ExpenseList from "@/components/expense/ExpenseList";
import { Card, CardContent } from "@/components/ui/card";
import { expenseService } from "@/services/expenseService";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]); // latest fetched
  const [displayedExpenses, setDisplayedExpenses] = useState([]); // shown on screen
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const usersData = await expenseService.getUsers();
        setUsers(usersData);
        await fetchExpenses({});
        setIsFirstLoad(false);
      } catch (e) {
        console.error("Init load failed:", e);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      fetchExpenses(filters);
    }
    
  }, [filters]);

  const fetchExpenses = async (activeFilters = {}) => {
    setLoading(true);
    try {
      const data = await expenseService.getExpenses(activeFilters);
      setExpenses(data);
      setDisplayedExpenses(data); // update display only after fetch
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    const cleaned = Object.entries(newFilters).reduce((acc, [key, val]) => {
      if (val && val !== "all") acc[key] = val;
      return acc;
    }, {});
    setFilters(cleaned);
  };

  const handleExpenseAdded = () => fetchExpenses(filters);
  const handleEditExpense = (exp) => setEditingExpense(exp);
  const handleEditComplete = () => {
    setEditingExpense(null);
    fetchExpenses(filters);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Heading */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Add, edit, and manage all your expenses in one place</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Expense Form */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ExpenseForm
                onExpenseAdded={handleExpenseAdded}
                editingExpense={editingExpense}
                onEditComplete={handleEditComplete}
              />
            </div>
          </div>

          {/* Filters + List */}
          <div className="xl:col-span-3 space-y-6">
            <ExpenseFilters onFiltersChange={handleFiltersChange} />

            
            {isFirstLoad && loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Loading expenses...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ExpenseList
                expenses={displayedExpenses}
                users={users}
                onExpenseUpdated={handleExpenseAdded}
                onEditExpense={handleEditExpense}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
