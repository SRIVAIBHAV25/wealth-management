import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { LineChart } from '@mui/x-charts/LineChart';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Simulations() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Goal Achievement Form
  const [currentAmount, setCurrentAmount] = useState('100000');
  const [targetAmount, setTargetAmount] = useState('1000000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [years, setYears] = useState('10');

  const token = localStorage.getItem('token');

  const runGoalSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scenario_name: 'Goal Achievement Simulation',
          assumptions: {
            current_amount: parseFloat(currentAmount),
            target_amount: parseFloat(targetAmount),
            monthly_contribution: parseFloat(monthlyContribution),
            expected_return: parseFloat(expectedReturn),
            years: parseInt(years),
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runWhatIfReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/simulations/what-if/returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: parseFloat(currentAmount),
          monthly_contribution: parseFloat(monthlyContribution),
          years: parseInt(years),
          return_rates: [6, 8, 10, 12, 15],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runWhatIfContributions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulations/what-if/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: parseFloat(currentAmount),
          target_amount: parseFloat(targetAmount),
          expected_return: parseFloat(expectedReturn),
          years: parseInt(years),
          contribution_amounts: [5000, 10000, 15000, 20000, 25000],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runMonteCarlo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulations/monte-carlo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: parseFloat(currentAmount),
          monthly_contribution: parseFloat(monthlyContribution),
          expected_return: parseFloat(expectedReturn),
          volatility: 15,
          years: parseInt(years),
          simulations: 1000,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12,
      px: { xs: 2, md: 4 },
      pb: 6,
      }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
        Financial Simulations
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
        <Tab label="Goal Achievement" />
        <Tab label="What-If: Returns" />
        <Tab label="What-If: Contributions" />
        <Tab label="Monte Carlo" />
      </Tabs>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
              Simulation Parameters
            </Typography>

            <TextField
              fullWidth
              label="Current Amount (₹)"
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: '#94a3b8' },
              }}
            />

            {(tab === 0 || tab === 2) && (
              <TextField
                fullWidth
                label="Target Amount (₹)"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                InputProps={{
                  style: { color: 'white' },
                }}
                InputLabelProps={{
                  style: { color: '#94a3b8' },
                }}
              />
            )}

            <TextField
              fullWidth
              label="Monthly Contribution (₹)"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: '#94a3b8' },
              }}
            />

            <TextField
              fullWidth
              label="Expected Return (%)"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: '#94a3b8' },
              }}
            />

            <TextField
              fullWidth
              label="Time Period (Years)"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: '#94a3b8' },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (tab === 0) runGoalSimulation();
                else if (tab === 1) runWhatIfReturns();
                else if (tab === 2) runWhatIfContributions();
                else if (tab === 3) runMonteCarlo();
              }}
              disabled={loading}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': { backgroundColor: '#1d4ed8' },
                py: 1.5,
              }}
            >
              {loading ? 'Running...' : 'Run Simulation'}
            </Button>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3, minHeight: 500 }}>
            <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
              Simulation Results
            </Typography>

            {!results && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  Configure parameters and click "Run Simulation"
                </Typography>
              </Box>
            )}

            {results && tab === 0 && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#020617',
                        borderRadius: 2,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Future Value
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="#10b981">
                        ₹{results.future_value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#020617',
                        borderRadius: 2,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Returns
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="#3b82f6">
                        ₹{results.total_returns.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: results.goal_achievable ? '#10b98120' : '#ef444420',
                    borderRadius: 2,
                    border: `1px solid ${results.goal_achievable ? '#10b981' : '#ef4444'}`,
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" color={results.goal_achievable ? '#10b981' : '#ef4444'}>
                    {results.goal_achievable ? '✅ Goal Achievable' : '❌ Goal Not Achievable'}
                  </Typography>
                  {!results.goal_achievable && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Shortfall: ₹{results.shortfall.toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {results.projections && results.projections.length > 0 && (
                  <LineChart
                    xAxis={[{ data: results.projections.map((p) => p.month) }]}
                    series={[
                      {
                        data: results.projections.map((p) => p.balance),
                        label: 'Projected Balance',
                        color: '#10b981',
                      },
                    ]}
                    width={600}
                    height={300}
                  />
                )}
              </Box>
            )}

            {results && (tab === 1 || tab === 2) && (
              <Box>
                {Object.entries(results).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: '#020617',
                      borderRadius: 2,
                      border: '1px solid #1e293b',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {key}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Future Value
                        </Typography>
                        <Typography variant="h6" color="#10b981">
                          ₹{value.future_value.toLocaleString()}
                        </Typography>
                      </Grid>
                      {value.total_returns && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Returns
                          </Typography>
                          <Typography variant="h6" color="#3b82f6">
                            ₹{value.total_returns.toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}

            {results && tab === 3 && (
              <Box>
                <Grid container spacing={2}>
                  {[
                    { label: 'Mean', value: results.mean, color: '#3b82f6' },
                    { label: 'Median', value: results.median, color: '#10b981' },
                    { label: '10th Percentile', value: results.percentile_10, color: '#ef4444' },
                    { label: '90th Percentile', value: results.percentile_90, color: '#10b981' },
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#020617',
                          borderRadius: 2,
                          border: '1px solid #1e293b',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color={item.color}>
                          ₹{item.value.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Based on 1,000 simulations with ±15% volatility
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
