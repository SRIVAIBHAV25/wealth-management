import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function InvestmentSimulations() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [currentAmount, setCurrentAmount] = useState('100000');
  const [targetAmount, setTargetAmount] = useState('1000000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [years, setYears] = useState('10');

  const token = localStorage.getItem('token');

  const textFieldStyle = {
    mb: 2,
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#1e293b' },
      '&:hover fieldset': { borderColor: '#3b82f6' },
    },
  };

  const calculateTimeToGoal = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API}/investments/simulate-growth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: parseFloat(currentAmount),
          target_amount: parseFloat(targetAmount),
          monthly_contribution: parseFloat(monthlyContribution),
          expected_return: parseFloat(expectedReturn),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        alert('Failed to calculate. Please check your inputs.');
      }
    } catch (err) {
      console.error(err);
      alert('Error calculating simulation');
    } finally {
      setLoading(false);
    }
  };

  const calculateMinimumContribution = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API}/investments/minimum-for-target`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: parseFloat(currentAmount),
          target_amount: parseFloat(targetAmount),
          years: parseInt(years),
          expected_return: parseFloat(expectedReturn),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        alert('Failed to calculate. Please check your inputs.');
      }
    } catch (err) {
      console.error(err);
      alert('Error calculating minimum contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12,
      px: { xs: 2, md: 4 },
      pb: 4,
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
          Investment Simulations
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Plan your investments with smart auto-calculations
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            color: '#94a3b8',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
          },
          '& .Mui-selected': {
            color: '#3b82f6 !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#3b82f6',
            height: 3,
          },
        }}
      >
        <Tab label="Time to Goal Calculator" icon={<AccessTimeIcon />} iconPosition="start" />
        <Tab label="Minimum Investment Finder" icon={<MonetizationOnIcon />} iconPosition="start" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{
            p: 4,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: 100,
          }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              {tab === 0 ? 'Calculate Time Needed' : 'Find Minimum Investment'}
            </Typography>

            <TextField
              fullWidth
              label="Current Amount (₹)"
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              sx={textFieldStyle}
              helperText="How much do you have now?"
              FormHelperTextProps={{ sx: { color: '#64748b' } }}
            />

            <TextField
              fullWidth
              label="Target Amount (₹)"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              sx={textFieldStyle}
              helperText="Your financial goal"
              FormHelperTextProps={{ sx: { color: '#64748b' } }}
            />

            {tab === 0 && (
              <TextField
                fullWidth
                label="Monthly Contribution (₹)"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                sx={textFieldStyle}
                helperText="How much can you invest monthly?"
                FormHelperTextProps={{ sx: { color: '#64748b' } }}
              />
            )}

            {tab === 1 && (
              <TextField
                fullWidth
                label="Target Timeframe (Years)"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                sx={textFieldStyle}
                helperText="When do you want to achieve this?"
                FormHelperTextProps={{ sx: { color: '#64748b' } }}
              />
            )}

            <TextField
              fullWidth
              label="Expected Annual Return (%)"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              sx={{ ...textFieldStyle, mb: 4 }}
              helperText="Typical: Stocks 12-15%, Mutual Funds 10-12%"
              FormHelperTextProps={{ sx: { color: '#64748b' } }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={tab === 0 ? calculateTimeToGoal : calculateMinimumContribution}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <TrendingUpIcon />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                py: 1.8,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.5)',
                },
                '&:disabled': {
                  background: '#1e293b',
                  color: '#64748b',
                },
              }}
            >
              {loading ? 'Calculating...' : tab === 0 ? 'Calculate Time' : 'Find Minimum'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{
            p: 4,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            minHeight: 500,
          }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              Simulation Results
            </Typography>

            {!results && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
              }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}>
                  <TrendingUpIcon sx={{ fontSize: 60, color: '#3b82f6' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1, textAlign: 'center' }}>
                  Ready to Plan Your Investment Journey?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                  Fill in the form and click calculate to see your personalized results
                </Typography>
              </Box>
            )}

            {results && tab === 0 && results.possible !== undefined && (
              <Box>
                {results.possible === false ? (
                  <Paper sx={{
                    p: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="h6" sx={{ color: '#ef4444', mb: 1 }}>
                      Goal Not Achievable
                    </Typography>
                    <Typography sx={{ color: '#fca5a5' }}>
                      {results.message}
                    </Typography>
                  </Paper>
                ) : (
                  <Box>
                    <Paper sx={{
                      p: 3,
                      mb: 3,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip
                          label="SUCCESS"
                          sx={{
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            fontWeight: 700,
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                          }}
                        />
                        <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                          Goal is Achievable!
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                        {results.message || 'You can reach your target with consistent investments'}
                      </Typography>
                    </Paper>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{
                          p: 3,
                          backgroundColor: 'rgba(2, 6, 23, 0.8)',
                          borderRadius: 2,
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                        }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                            Time Required
                          </Typography>
                          <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 700, mb: 0.5 }}>
                            {results.years}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                            years ({results.months} months)
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{
                          p: 3,
                          backgroundColor: 'rgba(2, 6, 23, 0.8)',
                          borderRadius: 2,
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                            Final Amount
                          </Typography>
                          <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                            ₹{results.final_amount?.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Paper sx={{
                      p: 3,
                      backgroundColor: 'rgba(2, 6, 23, 0.8)',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                        Investment Breakdown
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              Total Invested
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                              ₹{results.total_invested?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              Expected Returns
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                              ₹{results.total_returns?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              Return %
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 600 }}>
                              {results.total_invested > 0 
                                ? ((results.total_returns / results.total_invested) * 100).toFixed(1)
                                : 0}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}

            {results && tab === 1 && results.valid !== undefined && (
              <Box>
                {results.valid === false ? (
                  <Paper sx={{
                    p: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="h6" sx={{ color: '#ef4444', mb: 1 }}>
                      Invalid Parameters
                    </Typography>
                    <Typography sx={{ color: '#fca5a5' }}>
                      {results.message}
                    </Typography>
                  </Paper>
                ) : (
                  <Box>
                    <Paper sx={{
                      p: 3,
                      mb: 3,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                        Required Monthly Investment
                      </Typography>
                      <Typography variant="h2" sx={{ color: '#10b981', fontWeight: 800, mb: 1 }}>
                        ₹{results.monthly_contribution?.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                        {results.message || `Invest this amount monthly for ${results.target_years} years`}
                      </Typography>
                    </Paper>

                    {results.total_to_invest > 0 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Paper sx={{
                            p: 3,
                            backgroundColor: 'rgba(2, 6, 23, 0.8)',
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center',
                          }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                              Total Investment
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                              ₹{results.total_to_invest?.toLocaleString()}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper sx={{
                            p: 3,
                            backgroundColor: 'rgba(2, 6, 23, 0.8)',
                            borderRadius: 2,
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            textAlign: 'center',
                          }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                              Expected Returns
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                              ₹{results.expected_returns?.toLocaleString()}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper sx={{
                            p: 3,
                            backgroundColor: 'rgba(2, 6, 23, 0.8)',
                            borderRadius: 2,
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            textAlign: 'center',
                          }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                              Timeframe
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                              {results.target_years} years
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    )}

                    <Paper sx={{
                      p: 3,
                      mt: 3,
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 2,
                    }}>
                      <Typography variant="h6" sx={{ color: '#3b82f6', mb: 1, fontWeight: 600 }}>
                        💡 Pro Tip
                      </Typography>
                      <Typography sx={{ color: '#94a3b8' }}>
                        Consider increasing your monthly investment by 10-15% annually to account for inflation 
                        and accelerate your goal achievement!
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
