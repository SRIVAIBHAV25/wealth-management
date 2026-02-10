import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";

import KeyIcon from "@mui/icons-material/VpnKey";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Link as RouterLink } from "react-router-dom";
import AuthCard from "../components/AuthCard";

/* 🔒 INPUT STYLE LOCK (SAME FAMILY AS LOGIN / REGISTER) */
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
      borderColor: "#7c5ce0",
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

export default function ForgotPassword() {
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
      <AuthCard
        sx={{
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        {/* ICON */}
        <IconButton
          sx={{
            alignSelf: "center",
            backgroundColor: "#3b82f6",
            width: 44,
            height: 44,
            mb: 1,
            "& svg": { color: "white" },
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          <KeyIcon />
        </IconButton>

        {/* TITLE */}
        <Typography variant="h4" fontWeight={700} color="white">
          Forgot password?
        </Typography>

        {/* SUBTITLE */}
        <Typography color="#94a3b8" fontSize={14}>
          No worries, we&apos;ll send you reset instructions.
        </Typography>

        {/* EMAIL */}
        <Stack spacing={0.5} mt={3} textAlign="left">
          <Typography color="#cbd5f5" fontSize={14}>
            Email
          </Typography>
          <TextField
            placeholder="Enter your email"
            fullWidth
            sx={pillInputSx}
          />
        </Stack>

        {/* SEND BUTTON */}
        <Button
          size="large"
          sx={{
            mt: 3,
            height: 48,
            borderRadius: 999,
            backgroundColor: "#7c5ce0",
            color: "#ffffff",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#6b4fd8",
            },
          }}
        >
          SEND EMAIL
        </Button>

        {/* BACK LINK */}
        <Button
          component={RouterLink}
          to="/login"
          startIcon={<ArrowBackIcon />}
          sx={{
            mt: 2,
            color: "#94a3b8",
            textTransform: "none",
            "&:hover": {
              color: "#e5e7eb",
            },
          }}
        >
          Back to log in
        </Button>
      </AuthCard>
    </Box>
  );
}
