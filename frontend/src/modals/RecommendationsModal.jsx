import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { PieChart } from '@mui/x-charts/PieChart';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RecommendationsModal({ open, onClose }) {
  const [recommendations, setRecommendations] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const loadData = async () => {
    try {
      const [recRes, allocRes] = await Promise.all([
        fetch(`${API}/recommendations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/recommendations/allocation`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (recRes.ok) setRecommendations(await recRes.json());
      if (allocRes.ok) setAllocation(await allocRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/recommendations/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadData();
  }, [open]);

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
            AI Recommendations
          </Typography>
          <Box>
            <Button
              onClick={generateRecommendations}
              disabled={loading}
              sx={{ mr: 2, backgroundColor: '#2563eb', color: 'white' }}
            >
              {loading ? 'Generating...' : 'Generate New'}
            </Button>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent>
        {allocation && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Current Allocation</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart
                    series={[{
                      data: Object.entries(allocation.current_allocation || {}).map(([key, value], idx) => ({
                        id: idx,
                        value: value,
                        label: key.charAt(0).toUpperCase() + key.slice(1),
                      })),
                    }]}
                    width={400}
                    height={250}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Recommended Allocation</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart
                    series={[{
                      data: Object.entries(allocation.recommended_allocation || {}).map(([key, value], idx) => ({
                        id: idx,
                        value: value,
                        label: key.charAt(0).toUpperCase() + key.slice(1),
                      })),
                    }]}
                    width={400}
                    height={250}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Your Recommendations</Typography>
          {recommendations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#94a3b8' }}>No recommendations yet. Generate new ones!</Typography>
            </Box>
          ) : (
            <Box>
              {recommendations.map((rec) => (
                <Box key={rec.id} sx={{ p: 2, mb: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 1 }}>{rec.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>{rec.recommendation_text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
