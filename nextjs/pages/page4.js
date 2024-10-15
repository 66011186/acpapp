import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';

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
                body: JSON.stringify({ name: name, email: email, age: parseInt(age), height: parseFloat(height), sex: sex }),
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

    const handleUpdateUser = async (e) => {
        e.preventDefault();
    
        const id = setId;
    
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    age: parseInt(age), 
                    height: parseFloat(height),
                    sex,
                    email
                }),
            });
    
            if (!response.ok) {
                throw new Error('Update failed');
            }
    
            setSnackbarMessage('User updated successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    

    const handleGetUser = async (e) => {
    
        const response = await fetch(`/api/users/get${encodeURIComponent(name)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
    };

    const handleDeleteUser = async (e) => {
        const url = `/api/users/}`; // Correctly construct the URL with query parameter
    
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error('Deletion failed');
            }
    
            setSnackbarMessage('User deleted successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    
    

    return (
        <form>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <TextField label="Height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            <TextField label="Sex" value={sex} onChange={(e) => setSex(e.target.value)} />

            <Button onClick={handleCreateUser}>Create User</Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
            <Button onClick={handleDeleteUser}>Delete User</Button>
            <Button onClick={handleGetUser}>Get User</Button>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </form>
    );
};

export default Page4;
