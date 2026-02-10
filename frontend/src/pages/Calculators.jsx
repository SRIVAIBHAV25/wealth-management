import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Calculators() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // SIP Calculator
  const [sipMonthly, setSipMonthly] = useState('10000');
  const [sipReturn, setSipReturn] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  // Retirement Calculator
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [currentSavings, setCurrentSavings] = useState('500000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [retirementReturn, setRetirementReturn] = useState('12');
  const [desiredIncome, setDesiredIncome] = useState('50000');

  // Loan Calculator
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
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
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
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
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
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12,
      px: { xs: 2, md: 4 },
      pb: 6,
      }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
        Financial Calculators
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => { setTab(newValue); setResults(null); }} sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
        <Tab label="SIP Calculator" />
        <Tab label="Retirement Planning" />
        <Tab label="Loan Payoff" />
      </Tabs>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3 }}>
            {tab === 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
                  SIP Parameters
                </Typography>
                <TextField
                  fullWidth
                  label="Monthly Investment (₹)"
                  type="number"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#1e293b' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Expected Return (%)"
                  type="number"
                  value={sipReturn}
                  onChange={(e) => setSipReturn(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#1e293b' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Time Period (Years)"
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#1e293b' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={calculateSIP}
                  disabled={loading}
                  sx={{ backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' }, py: 1.5 }}
                >
                  {loading ? 'Calculating...' : 'Calculate SIP'}
                </Button>
              </>
            )}

            {tab === 1 && (
              <>
                <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
                  Retirement Parameters
                </Typography>
                <TextField
                  fullWidth
                  label="Current Age"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Retirement Age"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Current Savings (₹)"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Monthly Contribution (₹)"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Expected Return (%)"
                  type="number"
                  value={retirementReturn}
                  onChange={(e) => setRetirementReturn(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Desired Monthly Income (₹)"
                  type="number"
                  value={desiredIncome}
                  onChange={(e) => setDesiredIncome(e.target.value)}
                  sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={calculateRetirement}
                  disabled={loading}
                  sx={{ backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' }, py: 1.5 }}
                >
                  {loading ? 'Calculating...' : 'Calculate Retirement'}
                </Button>
              </>
            )}

            {tab === 2 && (
              <>
                <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
                  Loan Parameters
                </Typography>
                <TextField
                  fullWidth
                  label="Loan Amount (₹)"
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Tenure (Months)"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  sx={{ mb: 2, "sx={{ mb: 2 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 2 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 2 }} .MuiOutlinedInput-root": { "sx={{ mb: 2 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 2 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <TextField
                  fullWidth
                  label="Extra Monthly Payment (₹)"
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={calculateLoan}
                  disabled={loading}
                  sx={{ backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' }, py: 1.5 }}
                >
                  {loading ? 'Calculating...' : 'Calculate Loan'}
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, backgroundColor: '#0b1220', borderRadius: 3, minHeight: 500 }}>
            <Typography variant="h6" sx={{ mb: 3, "sx={{ mb: 3 }} .MuiInputBase-input": { color: "white" }, "sx={{ mb: 3 }} .MuiInputLabel-root": { color: "#94a3b8" }, "sx={{ mb: 3 }} .MuiOutlinedInput-root": { "sx={{ mb: 3 }} fieldset": { borderColor: "#1e293b" }, "sx={{ mb: 3 }}:hover fieldset": { borderColor: "#3b82f6" } } }}>
              Results
            </Typography>

            {!results && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  Enter parameters and calculate
                </Typography>
              </Box>
            )}

            {results && tab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Future Value
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="#10b981">
                      ₹{results.future_value.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Invested
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{results.total_invested.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Returns
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="#3b82f6">
                      ₹{results.total_returns.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Wealth Gained
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="#a855f7">
                      {results.wealth_gained.toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {results && tab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Corpus at Retirement
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="#10b981">
                      ₹{results.total_corpus_at_retirement.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Years to Retirement
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {results.years_to_retirement} years
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Required Corpus
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{results.required_corpus.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: results.corpus_sufficient ? '#10b98120' : '#ef444420',
                      borderRadius: 2,
                      border: `1px solid ${results.corpus_sufficient ? '#10b981' : '#ef4444'}`,
                    }}
                  >
                    <Typography variant="h6" color={results.corpus_sufficient ? '#10b981' : '#ef4444'}>
                      {results.corpus_sufficient ? '✅ Corpus Sufficient' : '❌ Corpus Insufficient'}
                    </Typography>
                    {!results.corpus_sufficient && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Shortfall: ₹{results.shortfall.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Possible Monthly Income
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="#10b981">
                      ₹{results.possible_monthly_income.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Returns
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="#3b82f6">
                      ₹{results.total_returns.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {results && tab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Monthly EMI
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="#3b82f6">
                      ₹{results.monthly_emi.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Payment
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{results.total_payment.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#020617', borderRadius: 2, border: '1px solid #1e293b' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interest
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="#ef4444">
                      ₹{results.total_interest.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                {results.with_extra_payment && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        With Extra Payment (₹{results.with_extra_payment.extra_monthly_payment})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, backgroundColor: '#10b98120', borderRadius: 2, border: '1px solid #10b981' }}>
                        <Typography variant="body2" color="text.secondary">
                          Months Saved
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="#10b981">
                          {results.with_extra_payment.months_saved}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, backgroundColor: '#10b98120', borderRadius: 2, border: '1px solid #10b981' }}>
                        <Typography variant="body2" color="text.secondary">
                          Interest Saved
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="#10b981">
                          ₹{results.with_extra_payment.interest_saved.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
