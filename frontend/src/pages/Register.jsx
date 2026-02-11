import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Divider,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* 🔒 INPUT STYLE LOCK (SAME AS LOGIN) */
const pillInputSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "white",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.15)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#60a5fa",
    },
  },
  "& input": {
    color: "white",
    padding: "12px 18px",
  },
  "& input::placeholder": {
    color: "#94a3b8",
    opacity: 1,
  },
};

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.detail || "Registration failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Grid container maxWidth={1000}>
        {/* LEFT PANEL — SAME AS IMAGE */}
        <Grid
          item
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            p: 5,
            background: "linear-gradient(180deg,#1e3a8a 0%,#020617 85%)",
            borderRadius: "16px 0 0 16px",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Join <br />
            Personalised Wealth Management System
          </Typography>
          <Typography color="gray" mt={2}>
            Create an account to start managing your wealth.
          </Typography>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid item xs={12} md={6}>
          <AuthCard sx={{ borderRadius: { md: "0 16px 16px 0" } }}>
            <Typography
              sx={{
                fontSize: 12,
                letterSpacing: 1.2,
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              WEALTH MANAGEMENT
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>
              Sign up
            </Typography>

            {error && (
              <Typography color="error" fontSize={14}>
                {error}
              </Typography>
            )}

            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography color="#cbd5f5">Full Name</Typography>
                <TextField
                  placeholder="Your name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={pillInputSx}
                />
              </Stack>

              <Stack spacing={0.5}>
                <Typography color="#cbd5f5">Email</Typography>
                <TextField
                  placeholder="your@email.com"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={pillInputSx}
                />
              </Stack>

              <Stack spacing={0.5}>
                <Typography color="#cbd5f5">Password</Typography>
                <TextField
                  type="password"
                  placeholder="********"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={pillInputSx}
                />
              </Stack>

              <Button
                onClick={handleRegister}
                disabled={loading}
                sx={{
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: "#f8fafc",
                  color: "#020617",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#e5e7eb",
                  },
                }}
              >
                {loading ? "Creating..." : "CREATE ACCOUNT"}
              </Button>

              <Typography align="center" color="#cbd5f5">
                Already have an account?{" "}
                <Typography
                  component={RouterLink}
                  to="/login"
                  sx={{ color: "#60a5fa", fontWeight: 600 }}
                >
                  Sign in
                </Typography>
              </Typography>
            </Stack>
          </AuthCard>
        </Grid>
      </Grid>
    </Box>
  );
}
