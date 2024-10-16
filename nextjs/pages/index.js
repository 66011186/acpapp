import Head from "next/head";
import { Box, Typography, Card, Paper, IconButton, MenuItem } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Link from 'next/link'; // Import Link for navigation
import UpdateIcon from '@mui/icons-material/Update';

function DashboardPage() {
  return (
    <Box textAlign="center" p={4} sx={{ bgcolor: '#1d2127', minHeight: '100vh', color: 'white' }}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard Page" />
      </Head>

      {/* Greeting Section */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Good Morning, User
          </Typography>
          <Typography variant="subtitle1" color="white">
            Let's do some workout today...
          </Typography>
        </Grid>

        <Grid item>
          <Link href="/page4" passHref>
            <IconButton sx={{ bgcolor: '#000', color: '#fff' }}>
              <UpdateIcon />
            </IconButton>
          </Link>
        </Grid>
      </Grid>

      {/* Metrics Section */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Link href="/page1" passHref>
            <Box sx={{ cursor: 'pointer' }}>
              <Card sx={{ padding: '20px', textAlign: 'center', bgcolor: '#292f35', color: 'white' }}>
                <Typography variant="h5">1.2</Typography>
                <Typography variant="subtitle2">Water liters</Typography>
              </Card>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Link href="/page2" passHref>
            <Box sx={{ cursor: 'pointer' }}>
              <Card sx={{ padding: '20px', textAlign: 'center', bgcolor: '#292f35', color: 'white' }}>
                <Typography variant="h5">2.54</Typography>
                <Typography variant="subtitle2">Kilo Calories</Typography>
              </Card>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Link href="/page3" passHref>
            <Box sx={{ cursor: 'pointer' }}>
              <Card sx={{ padding: '20px', textAlign: 'center', bgcolor: '#292f35', color: 'white' }}>
                <Typography variant="h5">3 Hr</Typography>
                <Typography variant="subtitle2"> Hours Exercise</Typography>
              </Card>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Link href="/page4" passHref>
            <Box sx={{ cursor: 'pointer' }}>
              <Card sx={{ padding: '20px', textAlign: 'center', bgcolor: '#292f35', color: 'white' }}>
                <Typography variant="h5">13</Typography>
                <Typography variant="subtitle2">Hours Sleeping</Typography>
              </Card>
            </Box>
          </Link>
        </Grid>

        <Box sx={{ marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              padding: '20px', 
              backgroundColor: '#292f35', 
              width: '650px', 
              margin: 'auto', 
              textAlign: 'center', 
              color: 'white' 
            }}
          >
            {/* Title Section */}
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ fontWeight: 'bold', marginBottom: '20px' }}
            >
              Workout Activity
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <Box sx={{ width: '20px', height: '20px', bgcolor: '#028e8c', marginRight: '5px' }} />
                <Typography variant="body1" color="white">Calories Intake</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '20px', height: '20px', bgcolor: '#2578cc', marginRight: '5px' }} />
                <Typography variant="body1" color="white">Calories Burned</Typography>
              </Box>
            </Box>
            {/* Line Chart Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart
                xAxis={[{ scaleType: 'band', data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }]}
                series={[
                  { data: [2, 1.7, 2.6, 2.3, 2, 1.8, 3] },
                  { data: [1, 0.5, 1.2, 1, 1, 0.8, 1.3] }
                ]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
                sx={(theme) => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: '#fff',
                      strokeWidth: 3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: '#fff',
                    },
                  },
                })}
              />
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
