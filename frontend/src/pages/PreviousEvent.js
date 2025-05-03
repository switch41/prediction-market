import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
import Web3 from 'web3';
import PredictionMarketContract from '../contracts/PredictionMarket.json';

const PreviousEvent = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError('');
      try {
        if (!window.ethereum) throw new Error('Please install MetaMask!');
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PredictionMarketContract.networks[networkId];
        const contract = new web3.eth.Contract(
          PredictionMarketContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        const count = await contract.methods.getPredictionsCount().call();
        const items = [];
        for (let i = 0; i < count; i++) {
          const details = await contract.methods.getPredictionDetails(i).call();
          // status: 0 = Active, 1 = Resolved
          if (details.status === "1" || details.status === 1) {
            items.push({ id: i, ...details });
          }
        }
        setPredictions(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Previous Events</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {predictions.length === 0 && (
              <Grid item xs={12}><Typography>No previous events.</Typography></Grid>
            )}
            {predictions.map((pred) => (
              <Grid item xs={12} sm={6} md={4} key={pred.id}>
                <Card elevation={3} sx={{ borderRadius: 3, background: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h6">{pred.description}</Typography>
                    <Typography color="text.secondary">Ended: {new Date(Number(pred.endTime) * 1000).toLocaleString()}</Typography>
                    <Typography color="text.secondary">Category: {pred.category}</Typography>
                    <Typography color="text.secondary">Outcome: {pred.outcome ? 'Yes' : 'No'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PreviousEvent; 