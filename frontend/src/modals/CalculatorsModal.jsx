import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function CalculatorsModal({ open, onClose }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [sipMonthly, setSipMonthly] = useState('10000');
  const [sipReturn, setSipReturn] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [currentSavings, setCurrentSavings] = useState('500000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [retirementReturn, setRetirementReturn] = useState('12');
  const [desiredIncome, setDesiredIncome] = useState('50000');

  const [loanPrincipal, setLoanPrincipal] = useState('1000000');
  const [loanRate, setLoanRate] = useState('8');
  const [loanTenure, setLoanTenure] = useState('240');
  const [extraPayment, setExtraPayment] = useState('0');

  const calculateSIP = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/calculators/sip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_investment: parseFloat(sipMonthly),
          expected_return_rate: parseFloat(sipReturn),
          time_period_years: parseInt(sipYears),
        }),
      });
      if (res.ok) setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRetirement = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/calculators/retirement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_age: parseInt(currentAge),
          retirement_age: parseInt(retirementAge),
          current_savings: parseFloat(currentSavings),
          monthly_contribution: parseFloat(monthlyContribution),
          expected_return_rate: parseFloat(retirementReturn),
          desired_monthly_income: parseFloat(desiredIncome),
        }),
      });
      if (res.ok) setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateLoan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/calculators/loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal: parseFloat(loanPrincipal),
          annual_interest_rate: parseFloat(loanRate),
          tenure_months: parseInt(loanTenure),
          extra_payment: parseFloat(extraPayment),
        }),
      });
      if (res.ok) setResults(await res.json());
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
            Financial Calculators
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent>
        <Tabs
          value={tab}
          onChange={(e, newValue) => { setTab(newValue); setResults(null); }}
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: '#94a3b8' },
            '& .Mui-selected': { color: 'white' },
          }}
        >
          <Tab label="SIP Calculator" />
          <Tab label="Retirement Planning" />
          <Tab label="Loan Payoff" />
        </Tabs>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2 }}>
              {tab === 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>SIP Parameters</Typography>
                  <TextField fullWidth label="Monthly Investment (₹)" type="number" value={sipMonthly} onChange={(e) => setSipMonthly(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Expected Return (%)" type="number" value={sipReturn} onChange={(e) => setSipReturn(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Time Period (Years)" type="number" value={sipYears} onChange={(e) => setSipYears(e.target.value)} sx={textFieldStyle} />
                  <Button fullWidth variant="contained" onClick={calculateSIP} disabled={loading} sx={{ backgroundColor: '#2563eb', py: 1.5 }}>
                    {loading ? 'Calculating...' : 'Calculate SIP'}
                  </Button>
                </>
              )}

              {tab === 1 && (
                <>
                  <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Retirement Parameters</Typography>
                  <TextField fullWidth label="Current Age" type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Retirement Age" type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Current Savings (₹)" type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Monthly Contribution (₹)" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Expected Return (%)" type="number" value={retirementReturn} onChange={(e) => setRetirementReturn(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Desired Monthly Income (₹)" type="number" value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} sx={textFieldStyle} />
                  <Button fullWidth variant="contained" onClick={calculateRetirement} disabled={loading} sx={{ backgroundColor: '#2563eb', py: 1.5 }}>
                    {loading ? 'Calculating...' : 'Calculate Retirement'}
                  </Button>
                </>
              )}

              {tab === 2 && (
                <>
                  <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Loan Parameters</Typography>
                  <TextField fullWidth label="Loan Amount (₹)" type="number" value={loanPrincipal} onChange={(e) => setLoanPrincipal(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Interest Rate (%)" type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Tenure (Months)" type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} sx={textFieldStyle} />
                  <TextField fullWidth label="Extra Monthly Payment (₹)" type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} sx={textFieldStyle} />
                  <Button fullWidth variant="contained" onClick={calculateLoan} disabled={loading} sx={{ backgroundColor: '#2563eb', py: 1.5 }}>
                    {loading ? 'Calculating...' : 'Calculate Loan'}
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 2, minHeight: 500 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Results</Typography>
              {!results ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ color: '#94a3b8' }}>Enter parameters and calculate</Typography>
                </Box>
              ) : (
                <Box>
                  {tab === 0 && results && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Future Value</Typography>
                          <Typography variant="h3" fontWeight={700} color="#10b981">₹{results.future_value.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Invested</Typography>
                          <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>₹{results.total_invested.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Returns</Typography>
                          <Typography variant="h6" fontWeight={600} color="#3b82f6">₹{results.total_returns.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {tab === 1 && results && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Total Corpus at Retirement</Typography>
                          <Typography variant="h3" fontWeight={700} color="#10b981">₹{results.total_corpus_at_retirement.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, backgroundColor: results.corpus_sufficient ? '#10b98120' : '#ef444420', borderRadius: 2, border: `1px solid ${results.corpus_sufficient ? '#10b981' : '#ef4444'}` }}>
                          <Typography variant="h6" color={results.corpus_sufficient ? '#10b981' : '#ef4444'}>
                            {results.corpus_sufficient ? '✅ Corpus Sufficient' : '❌ Corpus Insufficient'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {tab === 2 && results && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Monthly EMI</Typography>
                          <Typography variant="h3" fontWeight={700} color="#3b82f6">₹{results.monthly_emi.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Payment</Typography>
                          <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>₹{results.total_payment.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                          <Typography variant="h6" fontWeight={600} color="#ef4444">₹{results.total_interest.toLocaleString()}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
