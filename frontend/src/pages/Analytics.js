import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Web3 from 'web3';
import PredictionMarketContract from '../contracts/PredictionMarket.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({});
  const [marketData, setMarketData] = useState({});
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = PredictionMarketContract.networks[networkId];
          const contract = new web3.eth.Contract(
            PredictionMarketContract.abi,
            deployedNetwork && deployedNetwork.address
          );

          const accounts = await web3.eth.getAccounts();
          const userAddress = accounts[0];

          // Load category statistics
          const categories = ['Politics', 'Sports', 'Finance', 'Technology', 'Weather', 'Other'];
          const categoryStats = {};
          
          for (const category of categories) {
            const accuracy = await contract.methods.getCategoryAccuracy(category).call();
            categoryStats[category] = parseInt(accuracy);
          }

          // Load user statistics
          const userAccuracy = await contract.methods.getUserAccuracy(userAddress).call();
          const userStats = await contract.methods.userStats(userAddress).call();

          setCategoryData(categoryStats);
          setUserStats({
            accuracy: parseInt(userAccuracy),
            totalPredictions: parseInt(userStats.totalPredictions),
            correctPredictions: parseInt(userStats.correctPredictions),
            totalBets: parseInt(userStats.totalBets),
            totalWinnings: web3.utils.fromWei(userStats.totalWinnings, 'ether'),
          });

          // Load market data
          const count = await contract.methods.getPredictionsCount().call();
          const marketStats = {
            totalPredictions: parseInt(count),
            activePredictions: 0,
            resolvedPredictions: 0,
          };

          for (let i = 0; i < count; i++) {
            const prediction = await contract.methods.getPredictionDetails(i).call();
            if (prediction.status === '0') {
              marketStats.activePredictions++;
            } else {
              marketStats.resolvedPredictions++;
            }
          }

          setMarketData(marketStats);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Category Accuracy (%)',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  const marketChartData = {
    labels: ['Active', 'Resolved'],
    datasets: [
      {
        data: [marketData.activePredictions, marketData.resolvedPredictions],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  if (loading) {
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
          Market Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* User Statistics */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Statistics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Accuracy: {userStats.accuracy}%</Typography>
                <Typography>Total Predictions: {userStats.totalPredictions}</Typography>
                <Typography>Correct Predictions: {userStats.correctPredictions}</Typography>
                <Typography>Total Bets: {userStats.totalBets}</Typography>
                <Typography>Total Winnings: {userStats.totalWinnings} ETH</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Market Overview */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Market Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Total Predictions: {marketData.totalPredictions}</Typography>
                <Typography>Active Predictions: {marketData.activePredictions}</Typography>
                <Typography>Resolved Predictions: {marketData.resolvedPredictions}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Category Distribution */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <Box sx={{ height: 200 }}>
                <Pie data={marketChartData} />
              </Box>
            </Paper>
          </Grid>

          {/* Category Accuracy Chart */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category Accuracy
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Analytics; 