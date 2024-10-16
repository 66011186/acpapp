import Head from "next/head";
import { Box, Typography, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { startOfWeek } from 'date-fns';

function Page2() {
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');
    const [waterIntake, setWaterIntake] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            console.log('Water data retrieved:', result);

            const weeklyData = new Array(7).fill(0);
            const startOfCurrentWeek = startOfWeek(new Date());

            result.forEach(entry => {
                const entryDate = new Date(entry.entry_date);
                const dayIndex = Math.floor((entryDate - startOfCurrentWeek) / (1000 * 60 * 60 * 24));

                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyData[dayIndex] += parseFloat(entry.total_water);
                }
            });

            setData(weeklyData);
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

    const handleSubmitWaterIntake = async () => {
        if (!userId || !waterIntake || !entryDate) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`/api/water_data/${encodeURIComponent(userId)}`, {
                method: 'POST', // Assuming POST method for creating/updating water data
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entry_date: entryDate, water: parseFloat(waterIntake) }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch updated water data after submitting
            await handleGetWaterData();

            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Water intake submitted successfully.');

            // Clear input fields
            setWaterIntake('');
            setEntryDate('');
        } catch (error) {
            console.error('Error submitting water intake:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error submitting water intake: ${error.message}`);
        }
    };

    return (
        <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
            <Head>
                <title>Weekly Water Intake</title>
                <meta name="description" content="Track your weekly water intake" />
            </Head>

            <Typography variant="h4" sx={{ mb: 4 }}>
                Weekly Water Intake
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <TextField
                    label="User ID"
                    variant="outlined"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    sx={{ marginRight: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleGetWaterData}>
                    Fetch Water Data
                </Button>
            </Box>

            {/* Input for Water Intake */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <TextField
                    label="Water Intake (liters)"
                    variant="outlined"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="Entry Date (YYYY-MM-DD)"
                    variant="outlined"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    sx={{ marginRight: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmitWaterIntake}>
                    Submit Water Intake
                </Button>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Daily Water Intake
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <LineChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    series={[{ data }]} // Use the fetched data for the line chart
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

export default Page2;
