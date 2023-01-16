import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  Grid,
  IconButton,
  Snackbar,
  ThemeProvider,
} from '@mui/material';

const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com', {
  withCredentials: false,
});

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
      const response = await fetch(
        'https://readybutton.herokuapp.com/api/user/id',
        {
          headers: {
            'Access-Control-Allow-Origin': '*', // This is required for CORS support to work
          },
          credentials: 'include',
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
      } else {
        console.log('Error fetching userId');
      }
    }
    fetchUserId();
  }, []);

  async function handleClick() {
    // Check if user has already clicked the button
    if (!clickedUsers.includes(urlId) && userId) {
      setClickedUsers([...clickedUsers, urlId]);
      try {
        const response = await fetch(
          `https://readybutton.herokuapp.com/api/button/increment/${urlId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              userId: userId,
              'Access-Control-Allow-Origin': '*',
            },
            credentials: 'include',
          }
        );
        const data = await response.json();
        // Update the state with the new count
        setButtonData({ count: data.count });
        // Send socket event to server to emit event to all clients
        socket.emit('increment', data);
      } catch (err) {
        console.error('Error updating click count:', err);
      }
    }
  }

  async function handleReset() {
    try {
      const response = await fetch(
        `https://readybutton.herokuapp.com/api/button/reset/${urlId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      const data = await response.json();
      setButtonData(data);
      setClickedUsers([]);
    } catch (err) {
      console.error('Error resetting click count:', err);
    }
  }
  useEffect(() => {
    if (userId && !loading) {
      async function fetchData() {
        try {
          const response = await fetch(
            `https://readybutton.herokuapp.com/api/button/${urlId}`,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
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
        } finally {
        }
      }
      fetchData();

      // Only make requests when userId is not null and loading is false
      socket.on('snackbar', (data) => {
        setSnackbarOpen(true);
      });
      socket.on('increment', (data) => {
        setLoading(true);
        console.log('Increment event received');
        setButtonData({ count: data.count });
        setLoading(false);
      });
      socket.on('setLoading', (data) => {
        setLoading(data);
      });
    }
  }, [urlId, userId, loading, buttonData, clickedUsers]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: '100vh' }}
      >
        <Button
          style={{
            width: '3em',
            height: '3em',
            fontSize: '90px',
            borderRadius: '9999px',
            marginBottom: '20px',
            filter: 'drop-shadow(5px 5px 10px #000)',
          }}
          color='primary'
          variant='contained'
          onClick={handleClick}
        >
          {loading ? (
            <CircularProgress
              color='success'
              style={{
                position: 'absolute',
                width: '3em',
                height: '3em',
                fontSize: '90px',
              }}
            />
          ) : (
            buttonData.count
          )}
        </Button>
        <Button color='neutral' variant='contained' onClick={handleReset}>
          Reset
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity='success' sx={{ width: '100%' }}>
            Someone has clicked the button!
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
}
