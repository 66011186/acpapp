import Head from "next/head";
import { Box, Typography, Button, Snackbar, TextField, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { startOfWeek } from 'date-fns';

function DashboardPage() {
    const [calorieData, setCalorieData] = useState({ intake: [], burned: [], difference: [] });
    const [waterData, setWaterData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleGetUserData = async () => {
        if (!userId) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please enter a user ID.');
            return;
        }

        try {
            const response = await fetch(`/api/user_data/${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setUsername(result.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error fetching user data: ${error.message}`);
        }
    };

    const handleGetCalorieData = async () => {
        if (!userId) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please enter a user ID.');
            return;
        }

        try {
            const response = await fetch(`/api/calorie_data/${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const weeklyIntake = new Array(7).fill(0);
            const weeklyBurned = new Array(7).fill(0);
            const startOfCurrentWeek = startOfWeek(new Date());

            result.forEach(entry => {
                const entryDate = new Date(entry.entry_date);
                const dayIndex = Math.floor((entryDate - startOfCurrentWeek) / (1000 * 60 * 60 * 24));

                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyIntake[dayIndex] += parseFloat(entry.intake_cal);
                    weeklyBurned[dayIndex] += parseFloat(entry.burned_cal);
                }
            });

            const weeklyDifference = weeklyIntake.map((intake, index) => intake - weeklyBurned[index]);

            setCalorieData({ intake: weeklyIntake, burned: weeklyBurned, difference: weeklyDifference });
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Calorie data retrieved successfully.');

        } catch (error) {
            console.error('Error fetching calorie data:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error fetching calorie data: ${error.message}`);
        }
    };

    const handleGetWaterData = async () => {
        if (!userId) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please enter a user ID.');
            return;
        }

        try {
            const response = await fetch(`/api/water_data/${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const weeklyData = new Array(7).fill(0);
            const startOfCurrentWeek = startOfWeek(new Date());

            result.forEach(entry => {
                const entryDate = new Date(entry.entry_date);
                const dayIndex = Math.floor((entryDate - startOfCurrentWeek) / (1000 * 60 * 60 * 24));

                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyData[dayIndex] += parseFloat(entry.total_water);
                }
            });

            setWaterData(weeklyData);
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Water data retrieved successfully.');

        } catch (error) {
            console.error('Error fetching water data:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error fetching water data: ${error.message}`);
        }
    };

    const handleGetExerciseData = async () => {
        if (!userId) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please enter a user ID.');
            return;
        }
    
        try {
            const response = await fetch(`/api/exercise_data/${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            const weeklyExercise = new Array(7).fill(0);
            const startOfCurrentWeek = startOfWeek(new Date());
    
            result.forEach(entry => {
                const entryDate = new Date(entry.entry_date);
                const dayIndex = Math.floor((entryDate - startOfCurrentWeek) / (1000 * 60 * 60 * 24));
    
                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyExercise[dayIndex] += parseFloat(entry.total_exercise);
                }
            });
    
            setExerciseData(weeklyExercise);
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Exercise data retrieved successfully.');

        } catch (error) {
            console.error('Error fetching exercise data:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error fetching exercise data: ${error.message}`);
        }
    };

    const handleFetchData = async () => {
        await handleGetUserData();
        await handleGetCalorieData();
        await handleGetWaterData();
        await handleGetExerciseData();
    };

    return (
        <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Calorie, Water, and Exercise Intake Dashboard" />
            </Head>

            <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
               DashBoard
            </Typography>

            <Card sx={{ backgroundColor: '#292f35', padding: 2, borderRadius: 2, marginBottom: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            sx={{ marginRight: 2, backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                        />
                        <Button variant="contained" color="primary" onClick={handleFetchData}>
                            Fetch Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
                Weekly Calorie Intake and Burned
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                  sx={{
                      backgroundColor: '#3f51b5',
                      color: '#ffffff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginRight: 2, // Add some space between the boxes
                  }}
              >
                  Intake
              </Box>
              <Box
                  sx={{
                      backgroundColor: '#ff9800',
                      color: '#ffffff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                  }}
              >
                  Burned
              </Box>
          </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    series={[
                        { name: 'Intake', data: calorieData.intake, color: '#3f51b5' },
                        { name: 'Burned', data: calorieData.burned, color: '#ff9800' }
                    ]}
                    height={300}
                    margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
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

            <Typography variant="h5" sx={{ mb: 2, marginTop: 4, color: 'white' }}>
                Daily Calorie Difference
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    yAxis={[{ min: -1000, max: 1000 }]}
                    series={[{
                        name: 'Difference',
                        data: calorieData.difference,
                        color: '#2196f3',
                    }]}
                    height={300}
                    margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
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

            <Typography variant="h5" sx={{ mb: 2, marginTop: 4, color: 'white' }}>
                Weekly Water Intake
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    series={[{
                        name: 'Water Intake',
                        data: waterData,
                        color: '#4caf50',
                    }]}
                    height={300}
                    margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
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

            <Typography variant="h5" sx={{ mb: 2, marginTop: 4, color: 'white' }}>
                Weekly Exercise Amount
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    series={[{
                        name: 'Exercise Amount',
                        data: exerciseData,
                        color: '#ff5722',
                    }]}
                    height={300}
                    margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </Box>
    );
}

export default DashboardPage;
