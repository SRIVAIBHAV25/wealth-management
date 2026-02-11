import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Portfolio() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  
  // Format last updated time properly
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Not updated yet';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadInvestments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvestments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const totalValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.cost_basis, 0);
  const totalGain = totalValue - totalInvestment;
  const gainPercent = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;

  const assetAllocationData = investments.length > 0
    ? investments.map((inv, idx) => ({
        id: idx,
        value: inv.current_value,
        label: inv.symbol,
      }))
    : [];

  const performanceData = totalInvestment > 0 ? [
    { id: 0, value: totalInvestment, label: 'Invested', color: '#3b82f6' },
    { id: 1, value: Math.max(0, totalGain), label: 'Gains', color: '#10b981' },
  ] : [];

    return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 9,  // Added padding top
      px: { xs: 2, md: 4 },
      pb: 4,
    }}>
      <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 4 }}>
        Portfolio Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              Total Value
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              ₹{totalValue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: 3,
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              Total Invested
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              ₹{totalInvestment.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            background: totalGain >= 0
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: 3,
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              Total Gain/Loss
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              ₹{totalGain.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: 3,
          }}>
            <Typography variant="body2" sx={{ color: '#020617', mb: 1 }}>
              Return %
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#020617' }}>
              {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
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
              Asset Allocation
            </Typography>
            {assetAllocationData.length > 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{ data: assetAllocationData }]}
                  width={450}
                  height={300}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8' }}>No investments yet</Typography>
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
              Performance Breakdown
            </Typography>
            {performanceData.length > 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{ data: performanceData }]}
                  width={450}
                  height={300}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8' }}>No performance data</Typography>
              </Box>
            )}
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
        Holdings Details
      </Typography>
      {investments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#94a3b8' }}>
            No holdings yet. Add investments to get started!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {investments.map((inv) => {
            const gain = inv.current_value - inv.cost_basis;
            const gainPct = inv.cost_basis > 0 ? (gain / inv.cost_basis) * 100 : 0;

            return (
              <Grid item xs={12} md={6} key={inv.id}>
                <Box sx={{
                  p: 3,
                  backgroundColor: 'rgba(2, 6, 23, 0.6)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                        {inv.symbol}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {inv.asset_type.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ 
                        color: gain >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 600
                      }}>
                        {gain >= 0 ? '+' : ''}{gainPct.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: gain >= 0 ? '#10b981' : '#ef4444' }}>
                        {gain >= 0 ? '+' : ''}₹{gain.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Position
                      </Typography>
                      <Typography fontWeight={600} sx={{ color: 'white' }}>
                        {inv.units} units
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Avg Buy Price
                      </Typography>
                      <Typography fontWeight={600} sx={{ color: 'white' }}>
                        ₹{inv.avg_buy_price.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Cost Basis
                      </Typography>
                      <Typography fontWeight={600} sx={{ color: '#f59e0b' }}>
                        ₹{inv.cost_basis.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Current Value
                      </Typography>
                      <Typography fontWeight={600} sx={{ color: '#10b981' }}>
                        ₹{inv.current_value.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        mt: 1, 
                        pt: 2, 
                        borderTop: '1px solid rgba(255,255,255,0.1)' 
                      }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                          Last Price Update
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          ₹{inv.last_price.toLocaleString()} 
                          {inv.last_price_at && ` • ${formatLastUpdate(inv.last_price_at)}`}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
    </Box>
  );
}
