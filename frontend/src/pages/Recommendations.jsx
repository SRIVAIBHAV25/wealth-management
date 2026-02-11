import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const token = localStorage.getItem('token');

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllocationRecommendation = async () => {
    try {
      const res = await fetch(`${API}/recommendations/allocation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllocation(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      await fetch(`${API}/recommendations/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadRecommendations();
      loadAllocationRecommendation();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const clearRecommendations = async () => {
    if (!confirm('Are you sure you want to clear all recommendations?')) return;
    
    try {
      // Clear recommendations on backend
      const res = await fetch(`${API}/recommendations/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setRecommendations([]);
        setAllocation(null);
        alert('Recommendations cleared successfully');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to clear recommendations');
    }
  };

  useEffect(() => {
    loadRecommendations();
    loadAllocationRecommendation();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Recommendations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={clearRecommendations}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': { 
                borderColor: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            Clear All
          </Button>
          <Button
            startIcon={<AutoAwesomeIcon />}
            onClick={generateRecommendations}
            disabled={generating}
            sx={{
              backgroundColor: '#2563eb',
              color: 'white',
              '&:hover': { backgroundColor: '#1d4ed8' },
              borderRadius: 2,
              px: 3,
            }}
          >
            {generating ? 'Generating...' : 'Generate New'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Portfolio Allocation */}
        {allocation && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Portfolio Allocation
              </Typography>

              {allocation.needs_rebalance && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: '#f59e0b20',
                    borderRadius: 2,
                    border: '1px solid #f59e0b',
                  }}
                >
                  <Typography variant="body2" color="#f59e0b" fontWeight={600}>
                    ⚠️ Portfolio needs rebalancing
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Current Allocation
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: Object.entries(allocation.current_allocation || {}).map(([key, value], idx) => ({
                          id: idx,
                          value: value,
                          label: key.charAt(0).toUpperCase() + key.slice(1),
                        })),
                      },
                    ]}
                    width={250}
                    height={200}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Recommended Allocation
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: Object.entries(allocation.recommended_allocation || {}).map(([key, value], idx) => ({
                          id: idx,
                          value: value,
                          label: key.charAt(0).toUpperCase() + key.slice(1),
                        })),
                      },
                    ]}
                    width={250}
                    height={200}
                  />
                </Grid>
              </Grid>

              {allocation.suggestions && Object.keys(allocation.suggestions).length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Rebalancing Suggestions
                  </Typography>
                  {Object.entries(allocation.suggestions).map(([asset, suggestion]) => (
                    <Box
                      key={asset}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#020617',
                        borderRadius: 2,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        {asset.charAt(0).toUpperCase() + asset.slice(1)}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Current
                          </Typography>
                          <Typography variant="body1">{suggestion.current}%</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Target
                          </Typography>
                          <Typography variant="body1">{suggestion.target}%</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Action
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color={suggestion.action === 'increase' ? '#10b981' : '#ef4444'}
                          >
                            {suggestion.action === 'increase' ? '↑' : '↓'} {Math.abs(suggestion.difference)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Recommendations List */}
        <Grid item xs={12} md={allocation ? 6 : 12}>
          <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3, minHeight: 500 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Your Recommendations
            </Typography>

            {loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">Loading recommendations...</Typography>
              </Box>
            )}

            {!loading && recommendations.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <AutoAwesomeIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                <Typography color="text.secondary">No recommendations yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click "Generate New" to get personalized recommendations
                </Typography>
              </Box>
            )}

            {!loading && recommendations.length > 0 && (
              <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                {recommendations.map((rec) => (
                  <Box
                    key={rec.id}
                    sx={{
                      p: 3,
                      mb: 2,
                      backgroundColor: '#020617',
                      borderRadius: 2,
                      border: '1px solid #1e293b',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ mr: 1, color: '#10b981' }} />
                      <Typography variant="h6" fontWeight={600}>
                        {rec.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {rec.recommendation_text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
