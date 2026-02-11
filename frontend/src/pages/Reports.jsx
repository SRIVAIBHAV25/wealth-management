import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Reports() {
  const token = localStorage.getItem('token');
  const [downloading, setDownloading] = useState({});

  const downloadReport = async (endpoint, filename, reportKey) => {
    setDownloading(prev => ({ ...prev, [reportKey]: true }));
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success briefly
        setTimeout(() => {
          setDownloading(prev => ({ ...prev, [reportKey]: false }));
        }, 1000);
      } else {
        alert('Failed to download report. Please try again.');
        setDownloading(prev => ({ ...prev, [reportKey]: false }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to download report. Please check your connection.');
      setDownloading(prev => ({ ...prev, [reportKey]: false }));
    }
  };

  const reports = [
    {
      title: 'Portfolio Report',
      description: 'Complete portfolio summary with holdings, valuations, profit/loss analysis, and allocation breakdown',
      icon: <PictureAsPdfIcon sx={{ fontSize: 56, color: '#ef4444' }} />,
      color: '#ef4444',
      pdf: {
        endpoint: '/reports/portfolio/pdf',
        filename: `WealVix_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`,
      },
      csv: {
        endpoint: '/reports/portfolio/csv',
        filename: `WealVix_Portfolio_${new Date().toISOString().split('T')[0]}.csv`,
      },
    },
    {
      title: 'Goals Report',
      description: 'Track progress towards your financial goals with detailed breakdowns, timelines, and recommendations',
      icon: <AssessmentIcon sx={{ fontSize: 56, color: '#3b82f6' }} />,
      color: '#3b82f6',
      pdf: {
        endpoint: '/reports/goals/pdf',
        filename: `WealVix_Goals_${new Date().toISOString().split('T')[0]}.pdf`,
      },
      csv: null,
    },
    {
      title: 'Transactions Report',
      description: 'Complete history of all buy, sell, dividend transactions with timestamps and valuations',
      icon: <TableViewIcon sx={{ fontSize: 56, color: '#10b981' }} />,
      color: '#10b981',
      pdf: null,
      csv: {
        endpoint: '/reports/transactions/csv',
        filename: `WealVix_Transactions_${new Date().toISOString().split('T')[0]}.csv`,
      },
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12, 
      px: { xs: 2, md: 4 },
      pb: 6,
    }}>
      <Box sx={{ mb: 4 }}>
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
          Reports & Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Export your financial data in professional PDF or CSV format for analysis and record-keeping
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report, idx) => {
          const pdfKey = `${idx}-pdf`;
          const csvKey = `${idx}-csv`;
          
          return (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${report.color}30`,
                    border: `1px solid ${report.color}40`,
                  }
                }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  mb: 3,
                  p: 2,
                  backgroundColor: `${report.color}10`,
                  borderRadius: 3,
                }}>
                  {report.icon}
                </Box>

                <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, textAlign: 'center', color: 'white' }}>
                  {report.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 4, 
                    textAlign: 'center', 
                    flexGrow: 1,
                    color: '#94a3b8',
                    lineHeight: 1.8,
                  }}
                >
                  {report.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  {report.pdf && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={
                        downloading[pdfKey] ? (
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                        ) : (
                          <DownloadIcon />
                        )
                      }
                      onClick={() => downloadReport(report.pdf.endpoint, report.pdf.filename, pdfKey)}
                      disabled={downloading[pdfKey]}
                      sx={{
                        background: `linear-gradient(135deg, ${report.color} 0%, ${report.color}dd 100%)`,
                        '&:hover': { 
                          background: `linear-gradient(135deg, ${report.color}dd 0%, ${report.color}bb 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${report.color}40`,
                        },
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:disabled': {
                          background: '#1e293b',
                          color: '#64748b',
                        }
                      }}
                    >
                      {downloading[pdfKey] ? 'Downloading...' : 'Download PDF'}
                    </Button>
                  )}

                  {report.csv && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                        downloading[csvKey] ? (
                          <CircularProgress size={20} sx={{ color: '#10b981' }} />
                        ) : (
                          <DownloadIcon />
                        )
                      }
                      onClick={() => downloadReport(report.csv.endpoint, report.csv.filename, csvKey)}
                      disabled={downloading[csvKey]}
                      sx={{
                        borderColor: '#10b981',
                        color: '#10b981',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#059669',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                        },
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:disabled': {
                          borderColor: '#1e293b',
                          color: '#64748b',
                        }
                      }}
                    >
                      {downloading[csvKey] ? 'Downloading...' : 'Download CSV'}
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Information Section */}
      <Paper sx={{ 
        mt: 4, 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'white' }}>
          Report Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: 3,
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PictureAsPdfIcon sx={{ color: '#ef4444' }} />
                <Typography variant="h6" fontWeight={600} sx={{ color: '#ef4444' }}>
                  PDF Reports
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                • Professional formatted reports<br />
                • Perfect for printing and sharing<br />
                • Includes charts and visual analytics<br />
                • Comprehensive data summaries
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: 3,
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TableViewIcon sx={{ color: '#10b981' }} />
                <Typography variant="h6" fontWeight={600} sx={{ color: '#10b981' }}>
                  CSV Exports
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
                • Raw data exports for analysis<br />
                • Compatible with Excel & Google Sheets<br />
                • Easy data manipulation<br />
                • Ideal for custom reporting
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 3, 
          p: 3, 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: 3,
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
              💡 Pro Tip
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
            Download reports regularly to track your wealth management progress over time. All reports include the current date in the filename for easy organization.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
