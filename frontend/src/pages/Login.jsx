import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  Grid,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

/* 🔒 INPUT STYLE — LOCKED TO MATCH DESIGN */
const pillInputSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)", // 🔑 DARK GLASS
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  setLoading(true);

   try {
const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "Invalid credentials");
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", data.access_token);

    // ✅ Update auth context
    login({
      name: email.split("@")[0],
      email,
      token: data.access_token,
    });

    // ✅ Redirect to dashboard
    navigate("/dashboard", { replace: true });

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
        {/* LEFT PANEL — EXACT */}
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
            Personalized Wealth Management
          </Typography>
          <Typography color="#94a3b8" mt={2}>
            Manage your wealth smarter with insights tailored for you.
          </Typography>
        </Grid>

        {/* RIGHT PANEL — EXACT */}
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

            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "white", mt: 0.5 }}
            >
              Sign in
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Stack spacing={2} mt={1}>
              {/* EMAIL */}
              <Stack spacing={0.5}>
                <Typography sx={{ color: "#cbd5f5", fontSize: 14 }}>
                  Email
                </Typography>
                <TextField
                  placeholder="your@email.com"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={pillInputSx}
                />
              </Stack>

              {/* PASSWORD */}
              <Stack spacing={0.5}>
                <Typography sx={{ color: "#cbd5f5", fontSize: 14 }}>
                  Password
                </Typography>
                <TextField
                  type="password"
                  placeholder="********"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={pillInputSx}
                />
              </Stack>

              {/* REMEMBER */}
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#64748b",
                      "&.Mui-checked": { color: "#60a5fa" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "#cbd5f5", fontSize: 14 }}>
                    Remember me
                  </Typography>
                }
              />

              {/* SIGN IN */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                sx={{
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: "#f8fafc",
                  color: "#020617",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#e5e7eb" },
                }}
              >
                SIGN IN
              </Button>

              {/* FORGOT */}
              <Typography
                component={RouterLink}
                to="/forgot-password"
                align="center"
                sx={{
                  color: "#60a5fa",
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Forgot your password?
              </Typography>

              {/* SIGN UP */}
              <Typography align="center" fontSize={14} color="#cbd5f5">
                Don&apos;t have an account?{" "}
                <Typography
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: "#60a5fa",
                    fontWeight: 600,
                    display: "inline",
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </Typography>
              </Typography>
            </Stack>
          </AuthCard>
        </Grid>
      </Grid>
    </Box>
  );
}
