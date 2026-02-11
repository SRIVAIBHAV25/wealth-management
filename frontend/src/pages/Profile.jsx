import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Multicolor profile avatar component with gradient
const MultiColorProfileAvatar = ({ name, size = 120 }) => {
  const letter = (name?.charAt(0) || "U").toUpperCase();
  
  // Create gradient based on first letter
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ];
  
  const gradientIndex = letter.charCodeAt(0) % gradients.length;
  
  return (
    <Avatar
      sx={{ 
        background: gradients[gradientIndex],
        color: "white",
        width: size,
        height: size,
        fontSize: size / 2.5,
        fontWeight: 700,
        border: '4px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
      }}
    >
      {letter}
    </Avatar>
  );
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [kycStatus, setKycStatus] = useState('unverified');

  const token = localStorage.getItem('token');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || '');
        setRiskProfile(data.risk_profile || 'moderate');
        setKycStatus(data.kyc_status || 'unverified');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          risk_profile: riskProfile,
          kyc_status: kycStatus,
        }),
      });
      if (res.ok) {
        alert('Profile updated successfully!');
        loadProfile();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, pt: 12, textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' }}>
        <Typography sx={{ color: 'white' }}>Loading profile...</Typography>
      </Box>
    );
  }

  const getRiskProfileColor = (risk) => {
    if (risk === 'conservative') return '#10b981';
    if (risk === 'moderate') return '#f59e0b';
    if (risk === 'aggressive') return '#ef4444';
    return '#64748b';
  };

  const getRiskDescription = (risk) => {
    if (risk === 'conservative')
      return 'Prefers stable, low-risk investments with predictable returns and capital preservation';
    if (risk === 'moderate')
      return 'Balanced approach with mix of stable and growth investments for steady returns';
    if (risk === 'aggressive')
      return 'Seeks high returns with willingness to accept higher volatility and risk';
    return '';
  };

  const getRiskIcon = (risk) => {
    if (risk === 'conservative') return <SecurityIcon />;
    if (risk === 'moderate') return <AssessmentIcon />;
    if (risk === 'aggressive') return <TrendingUpIcon />;
    return null;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12, 
      px: { xs: 2, md: 4 },
      pb: 6,
    }}>
      <Typography 
        variant="h3" 
        fontWeight={700} 
        sx={{ 
          mb: 1, 
          color: 'white',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Professional Profile
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>
        Manage your wealth management profile and investment preferences
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              position: 'sticky',
              top: 100,
            }}
          >
            <MultiColorProfileAvatar name={profile?.name} />
            
            <Typography variant="h4" fontWeight={700} sx={{ mt: 3, mb: 1, color: 'white' }}>
              {profile?.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#94a3b8' }}>
              {profile?.email}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Chip
                icon={<VerifiedUserIcon />}
                label={kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                color={kycStatus === 'verified' ? 'success' : 'warning'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8', fontWeight: 600 }}>
                Investment Profile
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(2, 6, 23, 0.4)',
                borderRadius: 2,
                border: `2px solid ${getRiskProfileColor(riskProfile)}`,
              }}>
                <Box sx={{ color: getRiskProfileColor(riskProfile) }}>
                  {getRiskIcon(riskProfile)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                    {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Risk Profile
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                💡 Pro Tip
              </Typography>
              <Typography variant="caption" sx={{ color: 'white' }}>
                Keep your profile updated to receive personalized investment recommendations
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Edit Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 4, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <AccountBalanceWalletIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                Profile Settings
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': { color: 'white', fontSize: '1.1rem' },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#1e293b' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: 2 },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#94a3b8' }}>Risk Profile</InputLabel>
                  <Select
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value)}
                    label="Risk Profile"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e293b',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                      },
                      '& .MuiSvgIcon-root': { color: 'white' },
                    }}
                  >
                    <MenuItem value="conservative">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        Conservative
                      </Box>
                    </MenuItem>
                    <MenuItem value="moderate">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssessmentIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                        Moderate
                      </Box>
                    </MenuItem>
                    <MenuItem value="aggressive">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                        Aggressive
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#94a3b8' }}>KYC Status</InputLabel>
                  <Select
                    value={kycStatus}
                    onChange={(e) => setKycStatus(e.target.value)}
                    label="KYC Status"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e293b',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                      },
                      '& .MuiSvgIcon-root': { color: 'white' },
                    }}
                  >
                    <MenuItem value="unverified">Unverified</MenuItem>
                    <MenuItem value="verified">Verified</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(2, 6, 23, 0.6)',
                    borderRadius: 3,
                    border: `2px solid ${getRiskProfileColor(riskProfile)}`,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: 'white' }}>
                    About {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Profile
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                    {getRiskDescription(riskProfile)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={updateProfile}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                    },
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                  }}
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Risk Profile Comparison Guide */}
          <Paper sx={{ mt: 3, p: 4, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'white' }}>
              Investment Strategy Guide
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                    border: `2px solid ${getRiskProfileColor('conservative')}`,
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${getRiskProfileColor('conservative')}40`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SecurityIcon sx={{ color: '#10b981', fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#10b981' }}>
                        Conservative
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
                      Focus on capital preservation with stable returns
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(16, 185, 129, 0.3)' }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      • 30% Stocks<br />
                      • 50% Bonds<br />
                      • 20% Cash<br />
                      • Low volatility
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                    border: `2px solid ${getRiskProfileColor('moderate')}`,
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${getRiskProfileColor('moderate')}40`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AssessmentIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#f59e0b' }}>
                        Moderate
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
                      Balanced approach for steady growth
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(245, 158, 11, 0.3)' }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      • 60% Stocks<br />
                      • 30% Bonds<br />
                      • 10% Cash<br />
                      • Balanced risk
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: `2px solid ${getRiskProfileColor('aggressive')}`,
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${getRiskProfileColor('aggressive')}40`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TrendingUpIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#ef4444' }}>
                        Aggressive
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
                      Maximum growth with higher volatility
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(239, 68, 68, 0.3)' }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      • 80% Stocks<br />
                      • 15% Bonds<br />
                      • 5% Cash<br />
                      • High volatility
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
