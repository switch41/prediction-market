import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
} from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Prediction Market
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/" onClick={handleClose}>Home</MenuItem>
              <MenuItem component={RouterLink} to="/market" onClick={handleClose}>Market</MenuItem>
              <MenuItem component={RouterLink} to="/create" onClick={handleClose}>Create Event</MenuItem>
              <MenuItem component={RouterLink} to="/previous" onClick={handleClose}>Previous Event</MenuItem>
              <MenuItem component={RouterLink} to="/my-events" onClick={handleClose}>My Event</MenuItem>
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profile</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" component={RouterLink} to="/market">Market</Button>
            <Button color="inherit" component={RouterLink} to="/create">Create Event</Button>
            <Button color="inherit" component={RouterLink} to="/previous">Previous Event</Button>
            <Button color="inherit" component={RouterLink} to="/my-events">My Event</Button>
            <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 