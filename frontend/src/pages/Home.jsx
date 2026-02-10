import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Navbar from '../components/Navbar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import CalculateIcon from '@mui/icons-material/Calculate';
import InsightsIcon from '@mui/icons-material/Insights';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: '#10b981' }} />,
      title: 'Goal-Based Planning',
      description: 'Set and track your financial goals with personalized targets and milestones for retirement, home, education and more',
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 50, color: '#3b82f6' }} />,
      title: 'Portfolio Management',
      description: 'Track your investments across stocks, ETFs, mutual funds, and bonds with real-time valuations',
    },
    {
      icon: <ShowChartIcon sx={{ fontSize: 50, color: '#a855f7' }} />,
      title: 'Live Market Data',
      description: 'Get real-time portfolio valuations with automatic price updates from Yahoo Finance',
    },
    {
      icon: <CalculateIcon sx={{ fontSize: 50, color: '#f59e0b' }} />,
      title: 'Financial Calculators',
      description: 'Use SIP, Retirement, and Loan calculators for smart financial planning and decisions',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 50, color: '#ef4444' }} />,
      title: 'What-If Simulations',
      description: 'Run Monte Carlo simulations to test different investment scenarios and returns',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#14b8a6' }} />,
      title: 'AI Recommendations',
      description: 'Get personalized investment advice based on your unique risk profile and goals',
    },
  ];

  const benefits = [
    'Real-time portfolio tracking',
    'Automated price updates',
    'PDF & CSV reports',
    'Risk-based recommendations',
    'Goal progress visualization',
    'Transaction history',
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 15, md: 20 },
          pb: { xs: 8, md: 12 },
          background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  color: 'white',
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Your Financial Future,{' '}
                <Box component="span" sx={{ 
                  background: 'linear-gradient(135deg, #2563eb 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Simplified
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: '#94a3b8',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Track investments, plan goals, and grow your wealth with AI-powered insights and real-time market data
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Start Free Today
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
                
                <Button
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: 3,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.5)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Animated circles */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                      '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    width: '80%',
                    height: '80%',
                    borderRadius: 4,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>Portfolio Value</Typography>
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>₹12.5L</Typography>
                  </Box>
                  <Box sx={{ height: 2, background: 'linear-gradient(90deg, #10b981 0%, transparent 100%)', borderRadius: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Returns</Typography>
                    <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 600 }}>+23.5%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Goals Progress</Typography>
                    <Typography variant="h6" sx={{ color: '#a855f7', fontWeight: 600 }}>67%</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '₹500Cr+', label: 'Assets Managed' },
            { value: '15%', label: 'Avg. Returns' },
            { value: '24/7', label: 'Support' },
          ].map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ color: 'white', mb: 2 }}
          >
            Powerful Features for{' '}
            <Box component="span" sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Smart Investing
            </Box>
          </Typography>
          <Typography variant="h6" sx={{ color: '#94a3b8' }}>
            Everything you need to manage and grow your wealth
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(37, 99, 235, 0.2)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" fontWeight={600} sx={{ color: 'white', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ background: 'rgba(15, 23, 42, 0.4)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 3 }}>
                Why Choose WealVix?
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4 }}>
                Professional-grade wealth management tools designed for everyone
              </Typography>
              
              <Grid container spacing={2}>
                {benefits.map((benefit, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: '#10b981' }} />
                      <Typography sx={{ color: 'white' }}>{benefit}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ color: 'white', mb: 3 }}>
                  Start Your Wealth Journey Today
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                  Join thousands of users who trust WealVix for their financial planning and investment tracking needs.
                </Typography>
                <Button
                  fullWidth
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    },
                  }}
                >
                  Create Free Account
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
                💰 WealVix
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Your trusted partner for wealth management and financial planning.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#3b82f6' } }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Typography>
                <Typography 
                  sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#3b82f6' } }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Typography>
                <Typography 
                  sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#3b82f6' } }}
                  onClick={() => navigate('/contact')}
                >
                  Contact
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 2 }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Email: support@wealvix.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Phone: +91 1800-WEALTH
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              © 2024 WealVix. All rights reserved. | Infosys Internship Project
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
