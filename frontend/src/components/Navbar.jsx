import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Multicolor profile icon component inspired by Google logo
const DarkGradientAvatar = ({ name, onClick }) => {
  const letter = (name?.charAt(0) || "U").toUpperCase();

  return (
    <Avatar
      onClick={onClick}
      sx={{
        cursor: "pointer",
        ml: 2,
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "#ffffff",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.15)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.08)",
        },
      }}
    >
      {letter}
    </Avatar>
  );
};


export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar 
      position="absolute" 
      sx={{ 
        background: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 1100,
      }} 
      elevation={0}
    >
      <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexGrow: 1, 
            cursor: "pointer",
          }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="WealVix Logo"
            sx={{
              height: 40,
              width: 40,
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              fontSize: '1.5rem',
              letterSpacing: '0.5px',
            }}
          >
            WealVix
          </Typography>
        </Box>

        {!isAuthenticated ? (
          <>
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                component={Link} 
                to="/" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#3b82f6',
                  }
                }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to="/login" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.2)',
                  px: 3,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                sx={{ 
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  px: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                  }
                }}
              >
                Get Started
              </Button>
            </Stack>
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                component={Link} 
                to="/dashboard" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Dashboard
              </Button>
              <Button 
                component={Link} 
                to="/goals" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Goals
              </Button>
              <Button 
                component={Link} 
                to="/portfolio" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Portfolio
              </Button>
              <Button 
                component={Link} 
                to="/investments" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Investments
              </Button>
              <Button 
                component={Link} 
                to="/transactions" 
                sx={{ 
                  color: 'white', 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Transactions
              </Button>

              <DarkGradientAvatar
                name={user?.name}
                onClick={handleMenuOpen}
              />
            </Stack>

            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#0b1220',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        >
          <MenuItem disabled sx={{ color: '#94a3b8' }}>{user?.email}</MenuItem>
          <MenuItem 
            component={Link} 
            to="/profile" 
            onClick={handleMenuClose}
            sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' } }}
          >
            Profile
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
          >
            Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#0b1220',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        >
          {!isAuthenticated ? (
            [
              <MenuItem key="home" component={Link} to="/" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Home</MenuItem>,
              <MenuItem key="Contact" component={Link} to="/Contact" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Contact</MenuItem>,
              <MenuItem key="login" component={Link} to="/login" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Login</MenuItem>,
              <MenuItem key="register" component={Link} to="/register" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Get Started</MenuItem>,
            ]
          ) : (
            [
              <MenuItem key="dashboard" component={Link} to="/dashboard" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Dashboard</MenuItem>,
              <MenuItem key="profile" component={Link} to="/profile" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Profile</MenuItem>,
              <MenuItem key="goals" component={Link} to="/goals" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Goals</MenuItem>,
              <MenuItem key="portfolio" component={Link} to="/portfolio" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Portfolio</MenuItem>,
              <MenuItem key="investments" component={Link} to="/investments" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Investments</MenuItem>,
              <MenuItem key="transactions" component={Link} to="/transactions" onClick={handleMobileMenuClose} sx={{ color: 'white' }}>Transactions</MenuItem>,
              <MenuItem key="logout" onClick={() => { handleMobileMenuClose(); handleLogout(); }} sx={{ color: '#ef4444' }}>Logout</MenuItem>,
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
