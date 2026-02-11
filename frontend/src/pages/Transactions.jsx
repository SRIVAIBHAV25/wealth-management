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
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [symbol, setSymbol] = useState("");
  const [transactionType, setTransactionType] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [addingTransaction, setAddingTransaction] = useState(false);

  const token = localStorage.getItem("token");

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async () => {
    if (!symbol || !quantity || !price) {
      alert("Please fill all fields");
      return;
    }

    setAddingTransaction(true);
    try {
      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          type: transactionType,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      if (res.ok) {
        setSymbol("");
        setQuantity("");
        setPrice("");
        setTransactionType("buy");
        await loadTransactions();
        alert("Transaction added successfully!");
      } else {
        alert("Failed to add transaction");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding transaction");
    } finally {
      setAddingTransaction(false);
    }
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return;

    try {
      const res = await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok || res.status === 204) {
        await loadTransactions();
        alert("Transaction deleted successfully!");
      } else {
        alert("Failed to delete transaction");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting transaction");
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "buy":
        return { bg: "rgba(16, 185, 129, 0.1)", border: "#10b981", color: "#10b981" };
      case "sell":
        return { bg: "rgba(239, 68, 68, 0.1)", border: "#ef4444", color: "#ef4444" };
      case "dividend":
        return { bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", color: "#3b82f6" };
      default:
        return { bg: "rgba(148, 163, 184, 0.1)", border: "#94a3b8", color: "#94a3b8" };
    }
  };

  // Fixed date formatting - shows full date and time
  // ✅ FIXED date formatting — handles backend timezone bug safely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  // If backend forgot timezone, force UTC
  const safeDateString =
    dateString.endsWith("Z") || dateString.includes("+")
      ? dateString
      : dateString + "Z";

  const date = new Date(safeDateString);

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
            Transaction History
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Manage your buy/sell transactions
          </Typography>
        </Box>
        <Button
          startIcon={loading ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} /> : <RefreshIcon />}
          onClick={loadTransactions}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            },
            '&:disabled': {
              background: '#1e293b',
              color: '#64748b',
            }
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Add Transaction Form */}
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
              Add New Transaction
            </Typography>

            <TextField
              fullWidth
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., AAPL, TCS.NSE"
              sx={textFieldStyle}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#94a3b8' }}>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                label="Transaction Type"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e293b' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
                <MenuItem value="dividend">Dividend</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={textFieldStyle}
            />

            <TextField
              fullWidth
              label="Price per Unit (₹)"
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
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                💡 Transaction Info:
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                • Buy: Purchase stocks
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                • Sell: Sell your holdings
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                • Dividend: Record dividend received
              </Typography>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              onClick={addTransaction}
              disabled={addingTransaction}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                },
              }}
            >
              {addingTransaction ? "Adding..." : "Add Transaction"}
            </Button>
          </Paper>
        </Grid>

        {/* Transactions List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AccountBalanceWalletIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
              </Typography>
            </Box>

            {loading && transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#3b82f6' }} />
              </Box>
            ) : transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#94a3b8', mb: 2, fontSize: '1.1rem' }}>
                  No transactions yet
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Add your first transaction using the form
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {transactions.map((tx) => {
                  const typeStyle = getTypeColor(tx.type);
                  const totalValue = tx.quantity * tx.price + (tx.fees || 0);

                  return (
                    <Grid item xs={12} key={tx.id}>
                      <Paper sx={{
                        p: 3,
                        backgroundColor: 'rgba(2, 6, 23, 0.6)',
                        borderRadius: 2,
                        border: `1px solid ${typeStyle.border}40`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: typeStyle.border,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${typeStyle.border}30`,
                        }
                      }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6} md={2}>
                            <Box>
                              <Chip
                                label={tx.type.toUpperCase()}
                                size="small"
                                sx={{
                                  backgroundColor: typeStyle.bg,
                                  color: typeStyle.color,
                                  border: `1px solid ${typeStyle.border}`,
                                  fontWeight: 700,
                                  mb: 1,
                                }}
                              />
                              <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                                {tx.symbol}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                Quantity
                              </Typography>
                              <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                                {tx.quantity}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                Price
                              </Typography>
                              <Typography variant="h6" fontWeight={600} sx={{ color: '#3b82f6' }}>
                                ₹{tx.price.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                Total Value
                              </Typography>
                              <Typography variant="h6" fontWeight={700} sx={{ color: typeStyle.color }}>
                                ₹{totalValue.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6} sm={6} md={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                Date & Time
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                                {formatDate(tx.executed_at)}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={12} md={2}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                              <IconButton
                                onClick={() => deleteTransaction(tx.id)}
                                sx={{
                                  color: '#ef4444',
                                  border: '1px solid #ef4444',
                                  borderRadius: 2,
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: '#dc2626',
                                  }
                                }}
                              >
                                <DeleteIcon />
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
