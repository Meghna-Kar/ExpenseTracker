import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { expenseService } from "@/services/expenseService";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2, Receipt, Users, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * @param {{
 *   expenses: Array,
 *   users: Array,
 *   onExpenseUpdated: Function,
 *   onEditExpense: Function
 * }} props
 */
const ExpenseList = React.memo(({ expenses = [], users = [], onExpenseUpdated, onEditExpense }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [localExpenses, setLocalExpenses] = useState([]);

  // Keep alocal copy to prevent flickering
  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  // Create userId-to-name mapping
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((user) => {
      if (user?.id != null) map[user.id] = user.name;
    });
    return map;
  }, [users]);

  const getUserName = (userId) => userMap[userId] || `User ${userId}`;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    setDeletingId(id);
    try {
      await expenseService.deleteExpense(id);

      toast.success("Expense deleted successfully!");

      
      setLocalExpenses((prev) => prev.filter((e) => e.id !== id));
      if (onExpenseUpdated) {
        onExpenseUpdated((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalAmount = useMemo(() => {
  return localExpenses.reduce((sum, exp) => {
    const amount = Number(exp.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
}, [localExpenses]);

  if (!localExpenses.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No expenses found
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            No expenses match your filters. Try adding a new expense or changing filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Expense Summary</span>
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </CardTitle>
          <CardDescription>
            Showing {localExpenses.length} expense{localExpenses.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {localExpenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate max-w-[250px]">
                      {expense.description || expense.category || "No Description"}
                    </h3>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(expense.amount ?? 0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1 truncate">
                      <Users className="w-4 h-4" />
                      <span>{getUserName(expense.user_id)}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate">
                      <Receipt className="w-4 h-4" />
                      <span>{expense.category || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(expense.date ?? new Date())}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditExpense?.(expense)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {deletingId === expense.id ? "Deleting..." : "Delete"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default ExpenseList;
