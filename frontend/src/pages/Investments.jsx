import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [assetType, setAssetType] = useState("stock");
  const [units, setUnits] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  const loadInvestments = async () => {
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
    }
  };

  const refreshPrices = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API}/portfolio/refresh-prices`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await loadInvestments();
        alert("Prices updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to refresh prices. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInvestments();
    const interval = setInterval(loadInvestments, 30000);
    return () => clearInterval(interval);
  }, []);

  const addInvestment = async () => {
    if (!symbol || !units || !price) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/investments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_type: assetType,
          symbol: symbol.toUpperCase(),
          units: Number(units),
          avg_buy_price: Number(price),
        }),
      });

      if (res.ok) {
        setSymbol("");
        setUnits("");
        setPrice("");
        await loadInvestments();
        alert("Investment added! Click 'Refresh Prices' to get latest market price.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add investment");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestment = async (id) => {
    if (!confirm("Delete this investment?")) return;

    try {
      await fetch(`${API}/investments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadInvestments();
    } catch (err) {
      console.error(err);
    }
  };

  const textFieldStyle = {
    mb: 2,
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#1e293b" },
      "&:hover fieldset": { borderColor: "#3b82f6" },
    },
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      pt: 12,
      px: { xs: 2, md: 4 },
      pb: 4,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
            Realtime Investments
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Add investments and get live market prices from Alpha Vantage API
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
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
            '&:disabled': {
              background: '#1e293b',
              color: '#64748b',
            }
          }}
        >
          {refreshing ? 'Updating...' : 'Refresh Prices'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: 100,
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              Add New Investment
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#94a3b8' }}>Asset Type</InputLabel>
              <Select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                label="Asset Type"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e293b' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="etf">ETF</MenuItem>
                <MenuItem value="mutual_fund">Mutual Fund</MenuItem>
                <MenuItem value="bond">Bond</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Name"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., AAPL, RELIANCE.BSE"
              sx={textFieldStyle}
            />

            <TextField
              fullWidth
              label="Number of Units"
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              sx={textFieldStyle}
            />

            <TextField
              fullWidth
              label="Average Buy Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={textFieldStyle}
            />

            <Paper sx={{ 
              p: 2, 
              mb: 2, 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontWeight: 600 }}>
                💡 Stock Symbol Examples:
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                • US Stocks: AAPL, MSFT, GOOGL, TSLA
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                • Indian Stocks: TCS.NSE, INFY.NSE
              </Typography>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              onClick={addInvestment}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' 
                },
              }}
            >
              {loading ? "Adding..." : "Add Investment"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
              Your Portfolio ({investments.length} {investments.length === 1 ? 'Investment' : 'Investments'})
            </Typography>

            {investments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8', mb: 2, fontSize: '1.1rem' }}>
                  No investments yet. Add your first investment!
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  After adding, click "Refresh Prices" to get live market data from Alpha Vantage
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {investments.map((inv) => {
                  const totalValue = inv.current_value;
                  const totalCost = inv.cost_basis;
                  const gain = totalValue - totalCost;
                  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;
                  
                  // Format last updated time - show full date and time
                  const formatLastUpdate = (timestamp) => {
                    if (!timestamp) return "Not updated yet";

                    // Force UTC if backend forgot timezone
                    const safeTimestamp =
                      timestamp.endsWith("Z") || timestamp.includes("+")
                        ? timestamp
                        : timestamp + "Z";

                    const date = new Date(safeTimestamp);

                    return date.toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                  };

                  
                  const lastUpdate = formatLastUpdate(inv.last_price_at);
                  const isUpdated = inv.last_price_at;

                  return (
                    <Grid item xs={12} key={inv.id}>
                      <Paper sx={{
                        p: 3,
                        backgroundColor: 'rgba(2, 6, 23, 0.6)',
                        borderRadius: 2,
                        border: isUpdated ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                        position: 'relative',
                      }}>
                        {isUpdated && (
                          <Chip
                            label="LIVE"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.6 },
                              },
                            }}
                          />
                        )}

                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} sm={6} md={3}>
                            <Box>
                              <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 0.5, wordBreak: 'break-word' }}>
                                {inv.symbol}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                                {inv.asset_type.toUpperCase()}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {inv.units} units
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                Current Price
                              </Typography>
                              <Typography variant="h6" fontWeight={700} sx={{ color: '#3b82f6' }}>
                                ₹{inv.last_price.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                Avg Buy Price
                              </Typography>
                              <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                                ₹{inv.avg_buy_price.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                Cost Basis
                              </Typography>
                              <Typography variant="h6" fontWeight={600} sx={{ color: '#f59e0b' }}>
                                ₹{totalCost.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={3}>
                            <Box sx={{
                              p: 2,
                              backgroundColor: gain >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              borderRadius: 2,
                              border: `1px solid ${gain >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                              textAlign: 'center',
                            }}>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                Unrealized P&L
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                {gain >= 0 ? <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} /> : <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 20 }} />}
                                <Typography variant="h6" fontWeight={700} sx={{ color: gain >= 0 ? '#10b981' : '#ef4444' }}>
                                  {gain >= 0 ? '+' : ''}₹{Math.abs(gain).toLocaleString()}
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: gain >= 0 ? '#10b981' : '#ef4444' }}>
                                {gain >= 0 ? '+' : ''}{gainPct.toFixed(2)}%
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              pt: 2,
                              borderTop: '1px solid rgba(255,255,255,0.1)'
                            }}>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Last updated: {lastUpdate}
                              </Typography>
                              <IconButton
                                onClick={() => deleteInvestment(inv.id)}
                                sx={{
                                  color: '#ef4444',
                                  border: '1px solid #ef4444',
                                  borderRadius: 2,
                                  padding: '8px',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: '#dc2626',
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}