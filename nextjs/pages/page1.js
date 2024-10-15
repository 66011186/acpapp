import Head from "next/head";
import { Box, Typography, TextField, Button, Card } from "@mui/material";
import { useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

function Page1() {
  const [intake, setIntake] = useState('');
  const [data, setData] = useState([1.5, 2.0, 1.8, 2.5, 2.2, 2.7, 3.0]); // Sample initial data

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIntake = parseFloat(intake);
    if (!isNaN(newIntake) && newIntake >= 0) {
      setData((prevData) => [...prevData, newIntake]);
      setIntake('');
    }
  };

  return (
    <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
      <Head>
        <title>Daily Water Intake</title>
        <meta name="description" content="Track your daily water intake" />
      </Head>

      <Typography variant="h4" sx={{ mb: 4 }}>
        Track Your Daily Water Intake
      </Typography>

      {/* Input Section */}
      <Card sx={{ padding: '20px', bgcolor: '#292F35', boxShadow: 3, mb: 4, mx: 'auto', width: 'fit-content' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            type="number"
            label="Water Intake (liters)"
            variant="outlined"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            required
            sx={{ marginRight: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Intake
          </Button>
        </form>
      </Card>

      {/* Line Chart Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Weekly Water Intake
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <LineChart
          xAxis={[{ scaleType: 'band', data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }]}
          series={[{ data }]} // Use the data state for the line chart
          height={300}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          grid={{ vertical: true, horizontal: true }}
          sx={(theme) => ({
            [`.${axisClasses.root}`]: {
              [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                stroke: '#fff',
                strokeWidth: 2,
              },
              [`.${axisClasses.tickLabel}`]: {
                fill: '#fff',
              },
            },
          })}
        />
      </Box>
    </Box>
  );
}

export default Page1;
