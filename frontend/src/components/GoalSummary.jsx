export default function GoalSummary({ goals }) {
  const totalTarget = goals.reduce((a, g) => a + g.target_amount, 0);
  const totalSaved = goals.reduce((a, g) => a + g.saved_amount, 0);
  const percent = totalTarget
    ? ((totalSaved / totalTarget) * 100).toFixed(1)
    : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <div style={{ background: "#0b1220", padding: 16, borderRadius: 12 }}>
        Total Goals <br />
        <b>{goals.length}</b>
      </div>

      <div style={{ background: "#0b1220", padding: 16, borderRadius: 12 }}>
        Total Saved <br />
        <b>₹{totalSaved}</b>
      </div>

      <div style={{ background: "#0b1220", padding: 16, borderRadius: 12 }}>
        Progress <br />
        <b>{percent}%</b>
      </div>
    </div>
  );
}
