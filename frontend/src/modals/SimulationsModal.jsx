import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { PieChart } from '@mui/x-charts/PieChart';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SimulationsModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [currentAmount, setCurrentAmount] = useState('100000');
  const [targetAmount, setTargetAmount] = useState('1000000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [years, setYears] = useState('10');

  const token = localStorage.getItem('token');

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/simulations`, {
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

  const textFieldStyle = {
    mb: 2,
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#1e293b' },
      '&:hover fieldset': { borderColor: '#3b82f6' },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0b1220',
          backgroundImage: 'none',
          borderRadius: 3,
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
            Financial Simulations
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Simulation Parameters</Typography>
              <TextField fullWidth label="Current Amount (₹)" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} sx={textFieldStyle} />
              <TextField fullWidth label="Target Amount (₹)" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} sx={textFieldStyle} />
              <TextField fullWidth label="Monthly Contribution (₹)" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} sx={textFieldStyle} />
              <TextField fullWidth label="Expected Return (%)" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} sx={textFieldStyle} />
              <TextField fullWidth label="Time Period (Years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={textFieldStyle} />
              <Button fullWidth variant="contained" onClick={runSimulation} disabled={loading} sx={{ backgroundColor: '#2563eb', py: 1.5, color: 'white' }}>
                {loading ? 'Running...' : 'Run Simulation'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2, minHeight: 500 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Results</Typography>
              {!results ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ color: '#94a3b8' }}>Configure and run simulation</Typography>
                </Box>
              ) : (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">Future Value</Typography>
                        <Typography variant="h5" fontWeight={700} color="#10b981">₹{results.future_value.toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Returns</Typography>
                        <Typography variant="h5" fontWeight={700} color="#3b82f6">₹{results.total_returns.toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ p: 3, backgroundColor: results.goal_achievable ? '#10b98120' : '#ef444420', borderRadius: 2, border: `1px solid ${results.goal_achievable ? '#10b981' : '#ef4444'}`, mb: 3 }}>
                    <Typography variant="h6" color={results.goal_achievable ? '#10b981' : '#ef4444'}>
                      {results.goal_achievable ? '✅ Goal Achievable' : '❌ Goal Not Achievable'}
                    </Typography>
                    {!results.goal_achievable && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
                        Shortfall: ₹{results.shortfall.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                      series={[{
                        data: [
                          { id: 0, value: results.total_invested, label: 'Invested', color: '#3b82f6' },
                          { id: 1, value: results.total_returns, label: 'Returns', color: '#10b981' },
                        ],
                      }]}
                      width={400}
                      height={250}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
