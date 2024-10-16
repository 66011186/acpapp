import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Select, MenuItem, InputLabel } from '@mui/material';

const Page4 = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [sex, setSex] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/create`, { // Adjusted endpoint for creating user
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: id, name: name, age: parseInt(age), height: parseFloat(height), sex: sex, email: email}),
            });

            if (!response.ok) {
                throw new Error('Creation failed');
            }

            setSnackbarMessage('User created successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleGetUser = async () => {
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('User data retrieved:', data); // Handle the retrieved user data
    
            // Populate the form fields with the retrieved user data
            setName(data.name);
            setEmail(data.email);
            setAge(data.age);
            setHeight(data.height);
            setSex(data.sex);
    
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('User data retrieved successfully.');
            
        } catch (error) {
            console.error('Error fetching user:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error fetching user: ${error.message}`);
        }
    };
    

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
                method: 'PUT', // or 'PATCH' depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    age,
                    height,
                    sex,
                    email
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('User updated:', data); // Handle the success response
    
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('User updated successfully.');
    
            // Optionally clear the input fields
            setId('');
            setName('');
            setAge('');
            setHeight('');
            setSex('');
            setEmail('');
            
        } catch (error) {
            console.error('Error updating user:', error);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error updating user: ${error.message}`);
        }
    };
    
    
    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('User deleted:', data); // Handle success response
            setOpenSnackbar(true); // Optionally open a snackbar for success feedback
            setSnackbarSeverity('success');
            setSnackbarMessage('User deleted successfully.');
            
            // Clear the ID input after deletion
            setId('');
        } catch (error) {
            console.error('Error deleting user:', error);
            setOpenSnackbar(true); // Open snackbar for error feedback
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error deleting user: ${error.message}`);
        }
    };
    
    
    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#1d2127', 
            minHeight: '100vh', 
            color: 'white' 
        }}>
            <div style={{
                maxWidth: '50%',
                margin: '0 auto',
                backgroundColor: '#292f35',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h2>User Management</h2>
                <TextField 
                    label="ID" 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                    style={{ backgroundColor: '#708090', color: 'white' }} 
                    InputProps={{ style: { color: 'white' } }} 
                    InputLabelProps={{ style: { color: '#8AA7FF' } }} 
                />
                <TextField 
                    label="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    style={{ backgroundColor: '#708090' }} 
                    InputProps={{ style: { color: 'white' } }} 
                    InputLabelProps={{ style: { color: '#8AA7FF' } }} 
                />
                <TextField 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ backgroundColor: '#708090' }} 
                    InputProps={{ style: { color: 'white' } }} 
                    InputLabelProps={{ style: { color: '#8AA7FF' } }} 
                />
                <TextField 
                    label="Age" 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    style={{ backgroundColor: '#708090' }} 
                    InputProps={{ style: { color: 'white' } }} 
                    InputLabelProps={{ style: { color: '#8AA7FF' } }} 
                />
                <TextField 
                    label="Height" 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)} 
                    style={{ backgroundColor: '#708090' }} 
                    InputProps={{ style: { color: 'white' } }} 
                    InputLabelProps={{ style: { color: '#8AA7FF' } }} 
                />
                <div style={{ backgroundColor: '#708090' }}>
                    <InputLabel style={{ color: '#8AA7FF' }}></InputLabel>
                    <Select 
                        value={sex} 
                        onChange={(e) => setSex(e.target.value)} 
                        displayEmpty
                        style={{ backgroundColor: '#708090', color: 'white' }} 
                        inputProps={{ style: { color: 'white' } }} 
                    >
                        <MenuItem value="" disabled>Sex</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button onClick={handleCreateUser}>Create User</Button>
                    <Button onClick={handleUpdateUser}>Update User</Button>
                    <Button onClick={handleGetUser}>Get User</Button>
                    <Button onClick={() => handleDeleteUser(id)}>Delete User</Button>
                </div>
                <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
    
};

export default Page4;
