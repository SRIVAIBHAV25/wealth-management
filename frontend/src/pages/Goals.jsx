import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "@mui/material/Slider";
import { PieChart } from "@mui/x-charts/PieChart";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [goalType, setGoalType] = useState("custom");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  // Pre-creation simulation states
  const [preSimulationOpen, setPreSimulationOpen] = useState(false);
  const [targetYears, setTargetYears] = useState(5);
  const [targetMonths, setTargetMonths] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [preSimResult, setPreSimResult] = useState(null);
  const [preSimulating, setPreSimulating] = useState(false);
  
  // Editable monthly contribution in pre-simulation
  const [editingPreSimContribution, setEditingPreSimContribution] = useState(false);
  const [tempPreSimContribution, setTempPreSimContribution] = useState("");

  const token = localStorage.getItem("token");

  const loadGoals = async () => {
    try {
      const res = await fetch(`${API_BASE}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // PRE-CREATION SIMULATION - Calculate suggested monthly contribution
  const runPreCreationSimulation = async () => {
    if (!target) {
      alert("Please enter target amount");
      return;
    }

    const totalYears = targetYears + (targetMonths / 12);
    if (totalYears === 0) {
      alert("Please select a timeline");
      return;
    }

    setPreSimulating(true);
    try {
      const targetMonthsTotal = (targetYears * 12) + targetMonths;
      const targetAmount = parseFloat(target);
      const currentAmount = parseFloat(saved || 0);
      
      // Calculate required monthly contribution
      const monthlyRate = parseFloat(expectedReturn) / 12 / 100;
      const fvCurrent = currentAmount * Math.pow(1 + monthlyRate, targetMonthsTotal);
      const remaining = targetAmount - fvCurrent;
      
      let monthlyContribution = 0;
      if (remaining > 0) {
        if (monthlyRate === 0) {
          monthlyContribution = remaining / targetMonthsTotal;
        } else {
          monthlyContribution = remaining / ((Math.pow(1 + monthlyRate, targetMonthsTotal) - 1) / monthlyRate);
        }
      }
      
      const totalToInvest = monthlyContribution * targetMonthsTotal;
      const expectedReturns = targetAmount - currentAmount - totalToInvest;
      
      setPreSimResult({
        valid: true,
        monthly_contribution: Math.round(monthlyContribution * 100) / 100,
        total_to_invest: Math.round(totalToInvest * 100) / 100,
        expected_returns: Math.round(expectedReturns * 100) / 100,
        target_years: totalYears,
        current_amount: currentAmount,
        target_amount: targetAmount,
      });
      setTempPreSimContribution(Math.round(monthlyContribution * 100) / 100);
      setEditingPreSimContribution(false);
    } catch (err) {
      console.error(err);
      alert('Error calculating suggestion');
    } finally {
      setPreSimulating(false);
    }
  };

  // Recalculate when user edits monthly contribution
  const recalculateWithNewContribution = () => {
    if (!tempPreSimContribution || !target) return;

    const targetMonthsTotal = (targetYears * 12) + targetMonths;
    if (targetMonthsTotal === 0) return;

    const targetAmount = parseFloat(target);
    const currentAmount = parseFloat(saved || 0);
    const monthlyContribution = parseFloat(tempPreSimContribution);
    const monthlyRate = parseFloat(expectedReturn) / 12 / 100;

    // Calculate future value with new contribution
    let fvCurrent, fvContributions, futureValue;
    
    if (monthlyRate === 0) {
      futureValue = currentAmount + (monthlyContribution * targetMonthsTotal);
    } else {
      fvCurrent = currentAmount * Math.pow(1 + monthlyRate, targetMonthsTotal);
      fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, targetMonthsTotal) - 1) / monthlyRate);
      futureValue = fvCurrent + fvContributions;
    }

    const totalToInvest = monthlyContribution * targetMonthsTotal;
    const expectedReturns = futureValue - currentAmount - totalToInvest;
    const totalYears = targetYears + (targetMonths / 12);

    setPreSimResult({
      valid: true,
      monthly_contribution: monthlyContribution,
      total_to_invest: Math.round(totalToInvest * 100) / 100,
      expected_returns: Math.round(expectedReturns * 100) / 100,
      target_years: totalYears,
      current_amount: currentAmount,
      target_amount: targetAmount,
      future_value: Math.round(futureValue * 100) / 100,
    });
    setEditingPreSimContribution(false);
  };

  const openPreSimulation = () => {
    if (!target) {
      alert("Please enter a target amount first");
      return;
    }
    setPreSimulationOpen(true);
    setPreSimResult(null);
    setEditingPreSimContribution(false);
  };

  const addGoal = async () => {
    if (!title || !target) {
      alert("Please fill in Goal Title and Target Amount");
      return;
    }

    setLoading(true);
    try {
      // Use the suggested monthly contribution if simulation was run
      const monthlyContrib = preSimResult?.monthly_contribution || 0;
      
      // Calculate target date based on years and months
      const totalMonths = (targetYears * 12) + targetMonths;
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + totalMonths);
      
      const payload = {
        title: title,
        goal_type: goalType,
        target_amount: parseFloat(target),
        saved_amount: parseFloat(saved) || 0,
        target_date: targetDate.toISOString().split('T')[0], // Send only date part
        monthly_contribution: parseFloat(monthlyContrib) || 0,
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch(`${API}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTitle("");
        setTarget("");
        setSaved("");
        setGoalType("custom");
        setTargetYears(5);
        setTargetMonths(0);
        setPreSimResult(null);
        setPreSimulationOpen(false);
        await loadGoals();
        alert("Goal created successfully!");
      } else {
        const error = await response.json();
        console.error("Error response:", error); // Debug log
        alert(`Failed to create goal: ${JSON.stringify(error.detail || error)}`);
      }
    } catch (err) {
      console.error("Exception:", err);
      alert(`Error creating goal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id) => {
    if (!confirm("Delete this goal?")) return;

    try {
      await fetch(`${API}/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadGoals();
    } catch (err) {
      console.error(err);
      alert("Failed to delete goal");
    }
  };

  const updateGoal = async (goalId) => {
  if (!editingGoal) return;

  setLoading(true);
  try {
    const response = await fetch(`${API}/goals/${goalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    body: JSON.stringify({
  title: editingGoal.title,
  goal_type: editingGoal.goal_type,
  target_amount: Number(editingGoal.target_amount),
  saved_amount: Number(editingGoal.saved_amount),
  target_date: editingGoal.target_date,
  monthly_contribution: Number(editingGoal.monthly_contribution || 0),
}),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(JSON.stringify(err));
    }

    setGoals((prev) =>
  prev.map((g) =>
    g.id === goalId
      ? {
          ...g,
          target_amount: Number(editingGoal.target_amount),
          saved_amount: Number(editingGoal.saved_amount),
        }
      : g
  )
);

setEditingGoal(null);

    alert("Goal updated successfully!");
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update goal");
  } finally {
    setLoading(false);
  }
};


  const startEdit = (goal) => {
  setEditingGoal({
    id: goal.id,
    title: goal.title,
    goal_type: goal.goal_type,
    target_amount: String(goal.target_amount),
    saved_amount: String(goal.saved_amount),
    target_date: goal.target_date,
    monthly_contribution: goal.monthly_contribution ?? 0,
  });
};


  const cancelEdit = () => {
    setEditingGoal(null);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.saved_amount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const goalsChartData = goals.length > 0
    ? goals.map((g, idx) => ({
        id: idx,
        value: g.saved_amount,
        label: g.title,
      }))
    : [{ id: 0, value: 1, label: "No goals yet" }];

  const progressChartData = [
    { id: 0, value: totalSaved, label: "Saved" },
    { id: 1, value: Math.max(0, totalTarget - totalSaved), label: "Remaining" },
  ];

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: "white" }}>
        My Financial Goals
      </Typography>

      {/* Main Content - 40:60 Split */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Side - Add New Goal (40%) */}
        <Grid item xs={12} lg={4.8}>
          <Paper sx={{ p: 3, backgroundColor: "#0b1220", borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "white" }}>
              Add New Goal
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#1e293b" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#94a3b8" }}>Goal Type</InputLabel>
                  <Select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    label="Goal Type"
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                    }}
                  >
                    <MenuItem value="custom">Custom</MenuItem>
                    <MenuItem value="retirement">Retirement</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="emergency">Emergency Fund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Amount (₹)"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#1e293b" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Savings (₹)"
                  type="number"
                  value={saved}
                  onChange={(e) => setSaved(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#1e293b" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={openPreSimulation}
                  startIcon={<CalculateIcon />}
                  sx={{
                    borderColor: "#10b981",
                    color: "#10b981",
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                    },
                  }}
                >
                  Get Monthly Contribution Plan
                </Button>
              </Grid>

              {preSimResult && (
                <Grid item xs={12}>
                  <Alert severity="success" icon={<TrendingUpIcon />} sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      📊 Suggested Investment Plan
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Monthly:</Typography>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                          ₹{preSimResult.monthly_contribution.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Timeline:</Typography>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {preSimResult.target_years} years
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>To Invest:</Typography>
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          ₹{preSimResult.total_to_invest.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Returns:</Typography>
                        <Typography variant="body1" sx={{ color: '#3b82f6' }}>
                          ₹{preSimResult.expected_returns.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={addGoal}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                    py: 1.5,
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "ADD GOAL"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Side - Summary Cards and Charts (60%) */}
        <Grid item xs={12} lg={7.2}>
          <Grid container spacing={3}>
            {/* Summary Cards Row */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 0.5 }}>
                      Total Target
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "white" }}>
                      ₹{totalTarget.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(240, 147, 251, 0.3)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 0.5 }}>
                      Total Saved
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "white" }}>
                      ₹{totalSaved.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(79, 172, 254, 0.3)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 0.5 }}>
                      Progress
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "white" }}>
                      {overallProgress.toFixed(1)}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: "#0b1220", borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "white" }}>
                  Goals Distribution
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <PieChart
                    series={[{ data: goalsChartData }]}
                    width={300}
                    height={200}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: "#0b1220", borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "white" }}>
                  Overall Progress
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <PieChart
                    series={[{ 
                      data: progressChartData,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                    }]}
                    width={300}
                    height={200}
                    colors={['#10b981', '#64748b']}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Your Goals - Grid Cards */}
      <Paper sx={{ p: 3, backgroundColor: "#0b1220", borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "white" }}>
          Your Goals
        </Typography>

        {goals.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 4, color: "#64748b" }}>
            No goals created yet. Add your first goal above!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {goals.map((goal) => {
              const progress = (goal.saved_amount / goal.target_amount) * 100;
              const goalPieData = [
                { id: 0, value: goal.saved_amount, label: "Saved" },
                { id: 1, value: Math.max(0, goal.target_amount - goal.saved_amount), label: "Remaining" },
              ];

              return (
                <Grid item xs={12} md={6} lg={4} key={goal.id}>
                  <Paper
                    sx={{
                      p: 3,
                      backgroundColor: "#020617",
                      borderRadius: 3,
                      border: "1px solid #1e293b",
                      transition: "all 0.3s ease",
                      height: '100%',
                      "&:hover": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
                      },
                    }}
                  >
                    {editingGoal && editingGoal.id === goal.id ? (
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Target Amount"
                              type="number"
                              value={editingGoal.target_amount}
                              onChange={(e) =>
                                setEditingGoal({ ...editingGoal, target_amount: e.target.value })
                              }
                              sx={{
                                "& .MuiInputBase-input": { color: "white" },
                                "& .MuiInputLabel-root": { color: "#94a3b8" },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "#1e293b" },
                                  "&:hover fieldset": { borderColor: "#3b82f6" },
                                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Saved Amount"
                              type="number"
                              value={editingGoal.saved_amount}
                              onChange={(e) =>
                                setEditingGoal({ ...editingGoal, saved_amount: e.target.value })
                              }
                              sx={{
                                "& .MuiInputBase-input": { color: "white" },
                                "& .MuiInputLabel-root": { color: "#94a3b8" },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "#1e293b" },
                                  "&:hover fieldset": { borderColor: "#3b82f6" },
                                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                            variant="contained"
                            onClick={() => updateGoal(goal.id)}
                            disabled={
                              loading ||
                              !editingGoal?.target_amount ||
                              Number(editingGoal.target_amount) <= 0
                            }
                            sx={{ backgroundColor: "#10b981", flex: 1 }}
                          >
                            {loading ? <CircularProgress size={20} /> : "Save"}
                          </Button>
                              <Button
                                variant="outlined"
                                onClick={cancelEdit}
                                sx={{ borderColor: "#64748b", color: "#64748b", flex: 1 }}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                              <Typography variant="h6" fontWeight={600} sx={{ color: "white" }}>
                                {goal.title}
                              </Typography>
                              <Chip 
                                label={goal.goal_type} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: '#1e293b',
                                  color: '#94a3b8',
                                  textTransform: 'uppercase',
                                  fontSize: '0.7rem'
                                }} 
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                              Progress: {progress.toFixed(1)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Edit Goal">
                              <IconButton
                                onClick={() => startEdit(goal)}
                                sx={{
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#2563eb" },
                                  width: 36,
                                  height: 36,
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Goal">
                              <IconButton
                                onClick={() => deleteGoal(goal.id)}
                                sx={{
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#dc2626" },
                                  width: 36,
                                  height: 36,
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: "#1e293b",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#10b981",
                                borderRadius: 5,
                              },
                            }}
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                              Target
                            </Typography>
                            <Typography variant="h6" fontWeight={600} sx={{ color: "white", mb: 1.5 }}>
                              ₹{goal.target_amount.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                              Saved
                            </Typography>
                            <Typography variant="h6" fontWeight={600} sx={{ color: "#10b981" }}>
                              ₹{goal.saved_amount.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: '100%' }}>
                              <PieChart
                                series={[{ data: goalPieData }]}
                                width={150}
                                height={150}
                                colors={['#10b981', '#64748b']}
                                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {/* Pre-Creation Simulation Dialog with Sliders */}
      <Dialog 
        open={preSimulationOpen} 
        onClose={() => setPreSimulationOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0b1220', color: 'white', borderBottom: '1px solid #1e293b' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon />
            <Typography variant="h6">Investment Plan Calculator</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#0b1220', pt: 3 }}>
          <Alert severity="info" sx={{ mb: 3, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
            Get a suggested monthly contribution plan based on your target amount and timeline!
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Target Amount: <strong style={{ color: 'white' }}>₹{parseFloat(target || 0).toLocaleString()}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                Current Savings: <strong style={{ color: 'white' }}>₹{parseFloat(saved || 0).toLocaleString()}</strong>
              </Typography>
            </Grid>

            {/* Slider for Years */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Years
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" component="div" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                    {targetYears}
                  </Typography>
                </Box>
                <Slider
                  value={targetYears}
                  onChange={(e, newValue) => setTargetYears(newValue)}
                  min={0}
                  max={20}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 15, label: '15' },
                    { value: 20, label: '20' },
                  ]}
                  sx={{
                    color: '#3b82f6',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#3b82f6',
                      width: 20,
                      height: 20,
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#3b82f6',
                      height: 6,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#1e293b',
                      height: 6,
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: '#64748b',
                    },
                    '& .MuiSlider-markLabel': {
                      color: '#94a3b8',
                    },
                  }}
                />
              </Paper>
            </Grid>

            {/* Slider for Months */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Months
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" component="div" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {targetMonths}
                  </Typography>
                </Box>
                <Slider
                  value={targetMonths}
                  onChange={(e, newValue) => setTargetMonths(newValue)}
                  min={0}
                  max={11}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 3, label: '3' },
                    { value: 6, label: '6' },
                    { value: 9, label: '9' },
                    { value: 11, label: '11' },
                  ]}
                  sx={{
                    color: '#10b981',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#10b981',
                      width: 20,
                      height: 20,
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#10b981',
                      height: 6,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#1e293b',
                      height: 6,
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: '#64748b',
                    },
                    '& .MuiSlider-markLabel': {
                      color: '#94a3b8',
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
                Total Timeline: {targetYears} years {targetMonths} months
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expected Return Rate (%)"
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#1e293b' },
                    '&:hover fieldset': { borderColor: '#3b82f6' },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={runPreCreationSimulation}
                disabled={preSimulating}
                startIcon={<CalculateIcon />}
                sx={{
                  backgroundColor: '#10b981',
                  py: 1.5,
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                {preSimulating ? <CircularProgress size={24} /> : 'Calculate Investment Plan'}
              </Button>
            </Grid>

            {preSimResult && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #10b981' }}>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    Your Investment Plan
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          Required Monthly Investment
                        </Typography>
                        {!editingPreSimContribution ? (
                          <Tooltip title="Edit Monthly Contribution">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingPreSimContribution(true);
                                setTempPreSimContribution(preSimResult.monthly_contribution);
                              }}
                              sx={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                width: 28,
                                height: 28,
                                '&:hover': { backgroundColor: '#2563eb' },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </Box>
                      
                      {editingPreSimContribution ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            fullWidth
                            type="number"
                            value={tempPreSimContribution}
                            onChange={(e) => setTempPreSimContribution(e.target.value)}
                            sx={{
                              '& .MuiInputBase-input': { color: 'white', fontSize: '1.5rem', fontWeight: 700 },
                              '& .MuiInputLabel-root': { color: '#94a3b8' },
                            }}
                          />
                          <IconButton
                            onClick={recalculateWithNewContribution}
                            sx={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              '&:hover': { backgroundColor: '#059669' },
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => setEditingPreSimContribution(false)}
                            sx={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              '&:hover': { backgroundColor: '#dc2626' },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                          ₹{preSimResult.monthly_contribution.toLocaleString()}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Timeline
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {preSimResult.target_years} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {preSimResult.future_value ? 'Future Value' : 'Target Amount'}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#60a5fa', fontWeight: 600 }}>
                        ₹{(preSimResult.future_value || preSimResult.target_amount).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Total to Invest
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        ₹{preSimResult.total_to_invest.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Expected Returns
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#3b82f6' }}>
                        ₹{preSimResult.expected_returns.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  {preSimResult.future_value && preSimResult.future_value !== preSimResult.target_amount && (
                    <Alert severity={preSimResult.future_value >= preSimResult.target_amount ? "success" : "warning"} sx={{ mt: 2 }}>
                      {preSimResult.future_value >= preSimResult.target_amount 
                        ? `You'll exceed your target by ₹${(preSimResult.future_value - preSimResult.target_amount).toLocaleString()}!`
                        : `You'll fall short by ₹${(preSimResult.target_amount - preSimResult.future_value).toLocaleString()}. Consider increasing your contribution.`
                      }
                    </Alert>
                  )}
                  <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    This plan will be automatically saved with your goal!
                  </Alert>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#0b1220', p: 2, borderTop: '1px solid #1e293b' }}>
          <Button onClick={() => setPreSimulationOpen(false)} sx={{ color: '#94a3b8' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
