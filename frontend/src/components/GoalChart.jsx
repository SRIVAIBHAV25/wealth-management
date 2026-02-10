import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GoalChart({ data }) {
  return (
    <div
      style={{
        background: "#020617",
        padding: 16,
        borderRadius: 12,
        height: 260,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={28}   // 👈 compact bars
        >
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tickLine={false}
          />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
