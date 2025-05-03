import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Market from './pages/Market';
import CreatePrediction from './pages/CreatePrediction';
import PreviousEvent from './pages/PreviousEvent';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import { Container, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/create" element={<CreatePrediction />} />
            <Route path="/previous" element={<PreviousEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
