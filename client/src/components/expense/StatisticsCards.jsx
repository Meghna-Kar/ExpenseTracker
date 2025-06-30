import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const StatisticsCards = ({ userId }) => {
  const [statistics, setStatistics] = useState({
    topDays: [],
    monthlyChange: null,
    prediction: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const [topDaysRes, monthlyChangeRes, predictionRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/statistics/top-days/${userId}`),
          axios.get(`http://localhost:5000/api/statistics/monthly-change/${userId}`),
          axios.get(`http://localhost:5000/api/statistics/predict-next-month/${userId}`)
        ]);

        setStatistics({
          topDays: topDaysRes.data.data || [],
          monthlyChange: monthlyChangeRes.data.data || null,
          prediction: predictionRes.data.data || null
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (loading) return <div className="text-gray-500">Loading statistics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top 3 Spending Days */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Top 3 Spending Days
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statistics.topDays.length > 0 ? (
            statistics.topDays.map((day, index) => (
              <div key={index} className="text-sm text-gray-700">
                {format(new Date(day.spendDate), "dd MMM yyyy")} — ₹
                {Number(day.total_spent).toLocaleString("en-IN")}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No data available.</div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Percentage Change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Monthly Change
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {statistics.monthlyChange &&
          typeof statistics.monthlyChange.percentageChange === "number" ? (
            <span
              className={
                statistics.monthlyChange.percentageChange >= 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {statistics.monthlyChange.percentageChange >= 0 ? "+" : ""}
              {statistics.monthlyChange.percentageChange.toFixed(2)}%
            </span>
          ) : (
            <span className="text-gray-500">Not available</span>
          )}
        </CardContent>
      </Card>

      {/* Predicted Next Month Spend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Next Month Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {statistics.prediction &&
          typeof statistics.prediction.predicted === "number" ? (
            <>₹{Number(statistics.prediction.predicted).toLocaleString("en-IN")}</>
          ) : (
            <span className="text-gray-500">Not available</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
