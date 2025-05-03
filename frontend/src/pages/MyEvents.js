import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';

const MyEvents = () => (
  <Container maxWidth="lg">
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>My Events</Typography>
      <Grid container spacing={3}>
        {[1].map((id) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Card elevation={3} sx={{ borderRadius: 3, background: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6">My Event #{id}</Typography>
                <Typography color="text.secondary">You participated in this event.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

export default MyEvents; 