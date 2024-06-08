"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function DateChart({ data }) {
  return (
    <div className="flex flex-col items-center">
      <BarChart
        width={900}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
       
        <Bar type="monotone" dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}