import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StatisticsCards from "@/components/expense/StatisticsCards";
import {
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

const Statistics = () => {
  const [selectedUserId, setSelectedUserId] = useState("1");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Statistics
          </h1>
          <p className="text-gray-600">
            Detailed insights and analytics for your expense data
          </p>
        </div>

        {/* User Dropdown */}
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

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Top Spending Days</span>
              </CardTitle>
              <CardDescription>
                Find your top 3 highest spending days by total expenditure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                This statistic helps you identify patterns in your spending
                behavior and understand when you tend to spend the most money.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Monthly Change</span>
              </CardTitle>
              <CardDescription>
                Percentage change in spending from the previous month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track how your spending habits are changing over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span>Next Month Prediction</span>
              </CardTitle>
              <CardDescription>
                Predicted spending based on last 3 months average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get insights into your expected spending for the next month.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards (pass selected user) */}
        <StatisticsCards userId={selectedUserId} />

        
      </div>
    </Layout>
  );
};

export default Statistics;
