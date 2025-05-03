import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Web3 from 'web3';
import PredictionMarketContract from '../contracts/PredictionMarket.json';

const BATCH_SIZE = 6; // Number of predictions to load at once

const Home = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  // Initialize Web3 and contract
  const initializeWeb3 = useCallback(async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PredictionMarketContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PredictionMarketContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3Instance);
        setContract(contractInstance);
        return { web3Instance, contractInstance };
      } else {
        throw new Error('Please install MetaMask!');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  }, []);

  // Load predictions in batches
  const loadPredictions = useCallback(async () => {
    try {
      const { web3Instance, contractInstance } = await initializeWeb3() || {};
      if (!web3Instance || !contractInstance) return;

      const count = await contractInstance.methods.getPredictionsCount().call();
      const predictionsList = [];
      const totalBatches = Math.ceil(count / BATCH_SIZE);

      for (let batch = 0; batch < totalBatches; batch++) {
        const start = batch * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, count);
        
        const batchPromises = [];
        for (let i = start; i < end; i++) {
          batchPromises.push(contractInstance.methods.getPredictionDetails(i).call());
        }
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach((prediction, index) => {
          if (prediction.status === '0') { // Active predictions only
            predictionsList.push({
              id: start + index,
              ...prediction,
              endTime: new Date(prediction.endTime * 1000),
              creationTime: new Date(prediction.creationTime * 1000),
            });
          }
        });

        // Update state after each batch
        setPredictions(prev => [...prev, ...predictionsList]);
      }
    } catch (error) {
      setError('Error loading predictions: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [initializeWeb3]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const getCategoryColor = (category) => {
    const colors = {
      Politics: 'error',
      Sports: 'success',
      Finance: 'warning',
      Technology: 'info',
      Weather: 'primary',
      Other: 'default',
    };
    return colors[category] || 'default';
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (loading && predictions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Active Predictions
        </Typography>
        <Grid container spacing={3}>
          {predictions.map((prediction) => (
            <Grid item xs={12} sm={6} md={4} key={prediction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={prediction.category}
                      color={getCategoryColor(prediction.category)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {prediction.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created {formatDistanceToNow(prediction.creationTime)} ago
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ends {formatDistanceToNow(prediction.endTime)}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Yes: {Web3.utils.fromWei(prediction.totalYes, 'ether')} ETH
                    </Typography>
                    <Typography variant="body2">
                      No: {Web3.utils.fromWei(prediction.totalNo, 'ether')} ETH
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/prediction/${prediction.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {loading && predictions.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home; 