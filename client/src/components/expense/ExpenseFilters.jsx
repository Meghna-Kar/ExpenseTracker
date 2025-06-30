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
import { Filter, X, Calendar, Search } from "lucide-react";

const ExpenseFilters = ({ onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState({
    user_id: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadUsers();
    loadCategories();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await expenseService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await expenseService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const updateLocalFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    const cleared = {
      user_id: "all",
      category: "all",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = today;

    switch (range) {
      case "today":
        startDate = today;
        break;
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return;
    }

    setLocalFilters((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }));
  };

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => {
    if (key === "user_id" || key === "category") {
      return value !== "all" && value !== "";
    }
    return value !== "";
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </CardTitle>
        <CardDescription>
          Filter expenses by user, category, or date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Filter */}
        <div className="space-y-2">
          <Label>User</Label>
          <Select
            value={localFilters.user_id}
            onValueChange={(value) => updateLocalFilter("user_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={localFilters.category}
            onValueChange={(value) => updateLocalFilter("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Date Ranges */}
        <div className="space-y-2">
          <Label>Quick Date Ranges</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange("today")}
              className="justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange("week")}
              className="justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange("month")}
              className="justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Last Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange("year")}
              className="justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Last Year
            </Button>
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={localFilters.startDate}
              onChange={(e) => updateLocalFilter("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={localFilters.endDate}
              onChange={(e) => updateLocalFilter("endDate", e.target.value)}
            />
          </div>
        </div>

        {/*Search & Clear */}
        <div className="flex gap-2 pt-2">
          <Button onClick={applyFilters} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseFilters;
