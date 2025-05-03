import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import Web3 from 'web3';
import PredictionMarketContract from '../contracts/PredictionMarket.json';

const CreatePrediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    duration: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // Always request account access before sending a transaction
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PredictionMarketContract.networks[networkId];
      const contract = new web3.eth.Contract(
        PredictionMarketContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const accounts = await web3.eth.getAccounts();
      const durationInSeconds = parseInt(formData.duration) * 3600; // Convert hours to seconds
      const categoryValue = parseInt(formData.category, 10);

      await contract.methods
        .createPrediction(
          formData.description,
          durationInSeconds,
          categoryValue
        )
        .send({ from: accounts[0] });

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Prediction
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Prediction Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Duration (hours)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              label="Category"
            >
              <MenuItem value={0}>Sports</MenuItem>
              <MenuItem value={1}>Politics</MenuItem>
              <MenuItem value={2}>Finance</MenuItem>
              <MenuItem value={3}>Technology</MenuItem>
              <MenuItem value={4}>Weather</MenuItem>
              <MenuItem value={5}>Other</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Prediction'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePrediction; 