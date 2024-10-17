import Head from "next/head";
import { Box, Typography, Button, Snackbar, TextField, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart'; // Import BarChart
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { startOfWeek } from 'date-fns';

function Page2() {
    const [data, setData] = useState({ intake: [], burned: [], difference: [] });
    const [userId, setUserId] = useState('');
    const [intakeCal, setIntakeCal] = useState('');
    const [burnedCal, setBurnedCal] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            console.log('Calorie data retrieved:', result);

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

            setData({ intake: weeklyIntake, burned: weeklyBurned, difference: weeklyDifference });
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

    const handleSubmitCalorieData = async () => {
        if (!userId || !intakeCal || !burnedCal || !entryDate) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`/api/calorie_data/${encodeURIComponent(userId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entry_date: entryDate,
                    intake_cal: parseFloat(intakeCal),
                    burned_cal: parseFloat(burnedCal),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await handleGetCalorieData(); // Refresh the data after submission

            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Calorie intake submitted successfully.');

            // Clear input fields
            setIntakeCal('');
            setBurnedCal('');
            setEntryDate('');
        } catch (error) {
            console.error('Error submitting calorie intake:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error submitting calorie intake: ${error.message}`);
        }
    };

    return (
        <Box textAlign="center" p={4} sx={{ bgcolor: '#1D2127', minHeight: '100vh', color: 'white' }}>
            <Head>
                <title>Weekly Calorie Intake</title>
                <meta name="description" content="Track your weekly calorie intake" />
            </Head>
    
            <Typography variant="h4" sx={{ mb: 4 }}>
                Weekly Calorie Intake
            </Typography>
    
            <Card sx={{ width: 800, backgroundColor: '#292f35', padding: 2, marginBottom: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }} // Specific width
                        />
                        <Button variant="contained" color="primary" onClick={handleGetCalorieData}>
                            Fetch Calorie Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>
    
            <Card sx={{ width: 800, backgroundColor: '#292f35', padding: 2, marginBottom: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            label="Calorie Intake"
                            variant="outlined"
                            value={intakeCal}
                            onChange={(e) => setIntakeCal(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }} // Specific width
                        />
                        <TextField
                            label="Calories Burned"
                            variant="outlined"
                            value={burnedCal}
                            onChange={(e) => setBurnedCal(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }} // Specific width
                        />
                        <TextField
                            label="Entry Date (YYYY-MM-DD)"
                            variant="outlined"
                            value={entryDate}
                            onChange={(e) => setEntryDate(e.target.value)}
                            style={{ backgroundColor: '#708090', color: 'white' }}
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: '#8AA7FF' } }}
                            sx={{ marginRight: 2, width: 200 }} // Specific width
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}> {/* Added margin-top here */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSubmitCalorieData} 
                            sx={{ width: 200 }} // Match button width to other buttons
                        >
                            Submit Calorie Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Daily Calorie Data
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
                        { name: 'Intake', data: data.intake, color: '#3f51b5' }, // Color for intake
                        { name: 'Burned', data: data.burned, color: '#ff9800' }   // Orange color for burned
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

            <Typography variant="h5" sx={{ mb: 2, marginTop: 4 }}>
                Daily Calorie Difference
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: daysOfWeek }]}
                    yAxis={[{ min: -1000, max: 1000 }]}
                    series={[{
                        name: 'Difference',
                        data: data.difference,
                        color: '#2196f3', // Color for difference
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

export default Page2;
