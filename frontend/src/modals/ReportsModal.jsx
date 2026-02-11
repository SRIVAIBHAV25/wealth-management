import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ReportsModal({ open, onClose }) {
  const token = localStorage.getItem('token');

  const downloadReport = async (endpoint, filename) => {
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
      }
    } catch (err) {
      console.error(err);
      alert('Failed to download report');
    }
  };

  const reports = [
    {
      title: 'Portfolio Report',
      description: 'Complete portfolio summary with holdings and valuations',
      icon: <PictureAsPdfIcon sx={{ fontSize: 48, color: '#ef4444' }} />,
      pdf: { endpoint: '/reports/portfolio/pdf', filename: 'portfolio_report.pdf' },
      csv: { endpoint: '/reports/portfolio/csv', filename: 'portfolio.csv' },
    },
    {
      title: 'Goals Report',
      description: 'Track progress towards your financial goals',
      icon: <PictureAsPdfIcon sx={{ fontSize: 48, color: '#3b82f6' }} />,
      pdf: { endpoint: '/reports/goals/pdf', filename: 'goals_report.pdf' },
      csv: null,
    },
    {
      title: 'Transactions Report',
      description: 'Complete history of all transactions',
      icon: <TableViewIcon sx={{ fontSize: 48, color: '#10b981' }} />,
      pdf: null,
      csv: { endpoint: '/reports/transactions/csv', filename: 'transactions.csv' },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            Reports & Exports
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent>
        <Grid container spacing={3}>
          {reports.map((report, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {report.icon}
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>{report.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{report.description}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {report.pdf && (
                    <Button
                      variant="contained"
                      onClick={() => downloadReport(report.pdf.endpoint, report.pdf.filename)}
                      sx={{ backgroundColor: '#ef4444', color: 'white', flex: 1 }}
                    >
                      Download PDF
                    </Button>
                  )}
                  {report.csv && (
                    <Button
                      variant="outlined"
                      onClick={() => downloadReport(report.csv.endpoint, report.csv.filename)}
                      sx={{ borderColor: '#10b981', color: '#10b981', flex: 1 }}
                    >
                      Download CSV
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
