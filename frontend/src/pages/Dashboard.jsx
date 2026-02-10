import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import RecommendIcon from '@mui/icons-material/Recommend';
import DescriptionIcon from '@mui/icons-material/Description';
import CalculatorsModal from '../modals/CalculatorsModal';
import SimulationsModal from '../modals/SimulationsModal';
import RecommendationsModal from '../modals/RecommendationsModal';
import ReportsModal from '../modals/ReportsModal';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);
  const [simulationsOpen, setSimulationsOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const token = localStorage.getItem('token');

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrices = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API}/portfolio/refresh-prices`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !summary) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)'
      }}>
        <Typography variant="h5" sx={{ color: 'white' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  const { portfolio, goals } = summary;

  const portfolioAllocationData = portfolio.holdings_count > 0 ? [
    { id: 0, value: portfolio.total_investment, label: 'Invested', color: '#3b82f6' },
    { id: 1, value: Math.max(0, portfolio.total_gain), label: 'Gains', color: '#10b981' },
  ] : [];

  const goalsData = goals.total > 0 ? [
    { id: 0, value: goals.total_saved, label: 'Saved', color: '#10b981' },
    { id: 1, value: Math.max(0, goals.total_target - goals.total_saved), label: 'Remaining', color: '#64748b' },
  ] : [];

 return (
  <Box sx={{ 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
    pt: 10,
    px: { xs: 2, md: 4 },
    pb: 4,
  }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
            Financial Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Welcome back! Here's your wealth overview
          </Typography>
        </Box>
                <Button
          startIcon={refreshing ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} /> : <RefreshIcon />}
          onClick={refreshPrices}
          disabled={refreshing}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            minWidth: '180px',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
            '&:disabled': {
              background: '#1e293b',
              color: '#64748b',
            }
          }}
        >
          {refreshing ? 'Updating Prices...' : 'Refresh Live Prices'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>Portfolio Value</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
              ₹{portfolio.current_value.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Invested: ₹{portfolio.total_investment.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: portfolio.total_gain >= 0 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>Total Returns</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
              ₹{portfolio.total_gain.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {portfolio.gain_percent >= 0 ? '+' : ''}{portfolio.gain_percent.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrackChangesIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>Goals Progress</Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
              {goals.progress_percent.toFixed(1)}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {goals.active} Active | {goals.completed} Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              Portfolio Distribution
            </Typography>
            {portfolioAllocationData.length > 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{ data: portfolioAllocationData }]}
                  width={window.innerWidth < 768 ? 300 : 400}
                  height={300}
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  slotProps={{
                    legend: {
                      hidden: window.innerWidth < 768,
                    }
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8' }}>No portfolio data yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              Goals Achievement
            </Typography>
            {goalsData.length > 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{ data: goalsData }]}
                  width={window.innerWidth < 768 ? 300 : 400}
                  height={300}
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  slotProps={{
                    legend: {
                      hidden: window.innerWidth < 768,
                    }
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8' }}>No goals yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={600} sx={{ color: 'white', mb: 3 }}>
        Financial Tools
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            onClick={() => setCalculatorsOpen(true)}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(37, 99, 235, 0.3)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CalculateIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Calculators</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                SIP, Retirement & Loan
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            onClick={() => setSimulationsOpen(true)}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(168, 85, 247, 0.3)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <ScienceIcon sx={{ fontSize: 48, color: '#a855f7', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Simulations</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                What-if & Monte Carlo
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            onClick={() => setRecommendationsOpen(true)}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <RecommendIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Recommendations</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                AI-Powered Advice
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            onClick={() => setReportsOpen(true)}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Reports</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Export PDF & CSV
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ 
        p: 3, 
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
          Recent Transactions
        </Typography>
        {summary.recent_transactions.length > 0 ? (
          <Box>
            {summary.recent_transactions.map((tx) => (
              <Box
                key={tx.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 1,
                  backgroundColor: 'rgba(2, 6, 23, 0.6)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Box>
                  <Typography fontWeight={600} sx={{ color: 'white' }}>{tx.symbol}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {new Date(tx.executed_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography fontWeight={600} sx={{ color: tx.type === 'buy' ? '#10b981' : '#ef4444' }}>
                    {tx.type.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {tx.quantity} @ ₹{tx.price}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#94a3b8' }}>No transactions yet</Typography>
          </Box>
        )}
      </Paper>

      <CalculatorsModal open={calculatorsOpen} onClose={() => setCalculatorsOpen(false)} />
      <SimulationsModal open={simulationsOpen} onClose={() => setSimulationsOpen(false)} />
      <RecommendationsModal open={recommendationsOpen} onClose={() => setRecommendationsOpen(false)} />
      <ReportsModal open={reportsOpen} onClose={() => setReportsOpen(false)} />
    </Box>
  );
}
