import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import "../styles/CategoryChart.css";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6B7280",
];

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="category-chart-container">
        <h3 className="category-chart-title">Spending by Category</h3>
        <div className="category-chart-empty">No data available</div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item._id,
    value: item.total,
    count: item.count,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip-box">
          <p className="tooltip-title">{data.name}</p>
          <p className="tooltip-line">
            Amount:{" "}
            <span className="tooltip-amount">${data.value.toFixed(2)}</span>
          </p>
          <p className="tooltip-line">
            Transactions: <span className="tooltip-count">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="category-chart-container">
      <h3 className="category-chart-title">Spending by Category</h3>
      <div className="category-chart-graph">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontSize: "12px" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
