import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { expenseService } from "@/services/expenseService";
import { Plus, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ExpenseForm = ({ onExpenseAdded, editingExpense, onEditComplete }) => {
  const initialForm = {
    user_id: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load users and categories once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, categoriesData] = await Promise.all([
          expenseService.getUsers(),
          expenseService.getCategories(),
        ]);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    fetchData();
  }, []);

  // AUTOFILL when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        user_id: editingExpense.user_id.toString(),
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        description: editingExpense.description || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingExpense]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = "Please select a user";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Please enter a valid amount";
    if (!formData.date) newErrors.date = "Please select a date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    
    const safeFormData = {
      ...formData,
      date: new Date(formData.date).toISOString().split("T")[0],
      amount: parseFloat(formData.amount),
    };

    if (editingExpense) {
      await expenseService.updateExpense(editingExpense.id, safeFormData);
      toast.success("Expense updated successfully!");
      onEditComplete?.();
    } else {
      const newExpense = await expenseService.addExpense(safeFormData);
      toast.success("Expense added successfully!");
      onExpenseAdded?.(newExpense);
      setFormData(initialForm);
    }
    setErrors({});
  } catch (error) {
    console.error("Failed to save expense:", error);
    toast.error("Failed to save expense!");
    setErrors({ submit: error?.response?.data?.message || "Failed to save expense" });
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    if (editingExpense) {
      onEditComplete?.();
    } else {
      setFormData(initialForm);
      setErrors({});
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>{editingExpense ? "Edit Expense" : "Add New Expense"}</span>
        </CardTitle>
        <CardDescription>
          {editingExpense
            ? "Update the expense details"
            : "Enter the details for your new expense"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* User Selection */}
          <div className="space-y-2">
            <Label>User</Label>
            <Select
              value={formData.user_id}
              onValueChange={(value) =>
                setFormData({ ...formData, user_id: value })
              }
            >
              <SelectTrigger className={errors.user_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user_id && (
              <p className="text-sm text-red-500">{errors.user_id}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Input
              type="text"
              placeholder="Enter description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading
                ? "Saving..."
                : editingExpense
                ? "Update"
                : "Add Expense"}
            </Button>
            {(editingExpense || Object.values(formData).some((v) => v)) && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
