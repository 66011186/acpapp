import Head from "next/head";
import { Box, Typography, Button, Snackbar, TextField, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { startOfWeek } from 'date-fns'

function Page3() {
    const [data, setData] = useState({ exercise: [] });
    const [userId, setUserId] = useState('');
    const [exerciseAmount, setExerciseAmount] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleGetExerciseData = async () => {
        if (!userId) {
            setOpenSnackbar(true);
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
            console.log('Exercise data retrieved:', result);
    
            // Create an array to hold exercise data for each day of the week
            const weeklyExercise = new Array(7).fill(0);
            const startOfCurrentWeek = startOfWeek(new Date());
    
            result.forEach(entry => {
                const entryDate = new Date(entry.entry_date);
                const dayIndex = Math.floor((entryDate - startOfCurrentWeek) / (1000 * 60 * 60 * 24));
    
                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyExercise[dayIndex] += parseFloat(entry.total_exercise); // Use total_exercise from the database
                }
            });
    
            // Update the state with the fetched exercise data
            setData({ exercise: weeklyExercise });
    
            // Show success message
            setOpenSnackbar(true);
            setSnackbarMessage('Exercise data retrieved successfully.');
    
        } catch (error) {
            console.error('Error fetching exercise data:', error);
            setOpenSnackbar(true);
            setSnackbarMessage(`Error fetching exercise data: ${error.message}`);
        }
    };
    

    const handleSubmitExerciseData = async () => {
        if (!userId || !exerciseAmount || !entryDate) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill in all fields.');
            return;
        }
    
        try {
            const response = await fetch(`/api/exercise_data/${encodeURIComponent(userId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entry_date: entryDate, exercise: parseFloat(exerciseAmount) }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Refresh data after submission
            await handleGetExerciseData();
    
            setOpenSnackbar(true);
            setSnackbarMessage('Exercise data submitted successfully.');
    
            // Clear input fields
            setExerciseAmount('');
            setEntryDate('');
        } catch (error) {
            console.error('Error submitting exercise data:', error);
            setOpenSnackbar(true);
            setSnackbarMessage(`Error submitting exercise data: ${error.message}`);
        }
    };

    return (
        <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
            <Head>
                <title>Weekly Exercise Tracking</title>
                <meta name="description" content="Track your weekly exercise" />
            </Head>

            <Typography variant="h4" sx={{ mb: 4 }}>
                Weekly Exercise Tracking
            </Typography>

            <Card sx={{ width: 800, backgroundColor: '#292f35', padding: 2, marginBottom: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleGetExerciseData}>
                            Fetch Exercise Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ width: 800, backgroundColor: '#292f35', padding: 2, marginBottom: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <TextField
                            label="Exercise Amount (Hours)"
                            variant="outlined"
                            value={exerciseAmount}
                            onChange={(e) => setExerciseAmount(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }}
                        />
                        <TextField
                            label="Entry Date (YYYY-MM-DD)"
                            variant="outlined"
                            value={entryDate}
                            onChange={(e) => setEntryDate(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmitExerciseData}>
                            Submit Exercise Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Daily Exercise Data
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    series={[{ name: 'Exercise Hours', data: data.exercise, color: '#3f51b5' }]}
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
                severity="success"
            />
        </Box>
    );
}

export default Page3;
