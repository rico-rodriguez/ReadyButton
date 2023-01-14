import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {Button, createTheme, Grid, IconButton, Snackbar, ThemeProvider} from "@mui/material";

export default function ButtonClicker() {
    const { urlId } = useParams();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buttonData, setButtonData] = useState({});
    const [clickedUsers, setClickedUsers] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        async function fetchUserId() {
            console.log('Async function fetchUserId() called');
            // Make a request to your server to get the user's ID
            const response = await fetch('http://localhost:5000/api/user/id', {
                credentials: 'include',
            });
            if(response.ok) {
                const data = await response.json();
                setUserId(data.userId);
                setLoading(false);
            } else {
                console.log("Error fetching userId");
            }
        }
        fetchUserId();
    }, []);

    async function handleClick() {
        // Check if user has already clicked the button
        if (!clickedUsers.includes(urlId) && userId) {
            setClickedUsers([...clickedUsers, urlId]);
            try {
                const response = await fetch(`http://localhost:5000/api/button/increment/${urlId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                // Update the state with the new count
                setButtonData({ count: data.count });
            } catch (err) {
                console.error('Error updating click count:', err);
            }
        }
    }
    async function handleReset() {
        try {
            const response = await fetch(`http://localhost:5000/api/button/reset/${urlId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            setButtonData(data);
            setClickedUsers([]);

        } catch (err) {
            console.error('Error resetting click count:', err);
        }
    }

// Only make requests when userId is not null and loading is false
    useEffect(() => {
        if (userId && !loading) {
            async function fetchData() {
                try {
                    const response = await fetch(`http://localhost:5000/api/button/${urlId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch button data');
                    }
                    if (response.status === 404) {
                        //Button not found, create new button on server side
                    } else {
                        const data = await response.json();
                        setButtonData(data);
                    }
                } catch (error) {
                    console.error('Error fetching button data:', error);
                }
            }
            fetchData();
        }
    }, [urlId, userId, loading, buttonData, clickedUsers,]);
    const theme = createTheme({
        palette: {
            primary: {
                foreground: '#000000',
                main: '#fff',
            },
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
        },
    });
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh' }}
                >
                <Button style={{width: "3em",
                                height: "3em",
                                fontSize:"90px",
                                borderRadius:"9999px",
                                marginBottom:"20px",
                                filter:"drop-shadow(5px 5px 10px #000)"}}
                                color="primary" variant="contained" onClick={handleClick}>{buttonData.count}</Button>
                <Button color="neutral" variant="contained" onClick={handleReset}>Reset</Button>
                                <Snackbar
                                    open={snackbarOpen}
                                    message="Someone has clicked the button!"
                                    onClose={() => setSnackbarOpen(false)}
                                />
                </Grid>
            </ThemeProvider>
        </div>
    );

}
