import React from 'react';
import { Container, Typography, Card, CardContent, Avatar, Box, Grid } from '@mui/material';

const Profile = () => (
  <Container maxWidth="sm">
    <Box sx={{ my: 4 }}>
      <Card elevation={4} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ width: 80, height: 80, mb: 2 }}>U</Avatar>
            <Typography variant="h5">User Name</Typography>
            <Typography color="text.secondary">user@email.com</Typography>
          </Box>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Typography variant="subtitle1">Total Events</Typography>
              <Typography variant="h6">5</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Wins</Typography>
              <Typography variant="h6">2</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Accuracy</Typography>
              <Typography variant="h6">40%</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  </Container>
);

export default Profile; 