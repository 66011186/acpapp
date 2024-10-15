import Head from "next/head";
import { Box, Typography, TextField, Button, Card } from "@mui/material";
import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

function Page2() {
  const [caloriesIntake, setCaloriesIntake] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [data, setData] = useState([
    { day: 'Sun', intake: 2000, burned: 1500 },
    { day: 'Mon', intake: 1800, burned: 1600 },
    { day: 'Tue', intake: 2200, burned: 1700 },
    { day: 'Wed', intake: 1900, burned: 1800 },
    { day: 'Thu', intake: 2100, burned: 1500 },
    { day: 'Fri', intake: 2300, burned: 2000 },
    { day: 'Sat', intake: 2500, burned: 1900 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIntake = parseFloat(caloriesIntake);
    const newBurned = parseFloat(caloriesBurned);

    if (!isNaN(newIntake) && newIntake >= 0 && !isNaN(newBurned) && newBurned >= 0) {
      setData((prevData) => [
        ...prevData,
        { day: `Day ${prevData.length + 1}`, intake: newIntake, burned: newBurned },
      ]);
      setCaloriesIntake('');
      setCaloriesBurned('');
    }
  };

  return (
    <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
      <Head>
        <title>Calories Intake Tracker</title>
        <meta name="description" content="Track your calories intake and burned" />
      </Head>

      <Typography variant="h4" sx={{ mb: 4 }}>
        Track Your Calories Intake and Burned
      </Typography>

      {/* Input Section */}
      <Card sx={{ padding: '20px', bgcolor: '#292F35', boxShadow: 3, mb: 4, mx: 'auto', width: 'fit-content' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            type="number"
            label="Calories Intake (kcal)"
            variant="outlined"
            value={caloriesIntake}
            onChange={(e) => setCaloriesIntake(e.target.value)}
            required
            sx={{ marginRight: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            type="number"
            label="Calories Burned (kcal)"
            variant="outlined"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            required
            sx={{ marginRight: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Data
          </Button>
        </form>
      </Card>

      {/* Bar Chart Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Weekly Calories Intake and Burned
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart
          data={data}
          height={300}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          xField="day"
          yFields={["intake", "burned"]}
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

export default Page2;
