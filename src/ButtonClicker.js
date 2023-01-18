import {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import mojs from '@mojs/core';
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
  const [buttonData, setButtonData] = useState({});
  const [clickedUsers, setClickedUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpenReset, setSnackbarOpenReset] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    async function fetchUserId() {
      // Make a request to your server to get the user's ID
      const response = await fetch(
        'https://readybutton.herokuapp.com/api/user/id',
        {
          credentials: 'include',
          headers: {
            'Access-Control-Allow-Origin': '*', // This is required for CORS support to work
            'Access-Control-Allow-Credentials': true, // This is required for cookies, authorization headers with HTTPS
          },
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
    {animatedClick()}
    setEmojiVisible(true);
    setTimeout(() => {
      setEmojiVisible(false);
    }, 5000);
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
    setDataLoaded(false);
      setButtonData(data);
      setClickedUsers([]);
      setDataLoaded(true);
      socket.emit('reset', data);
    } catch (err) {
      console.error('Error resetting click count:', err);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setDataLoaded(false);
      try {
        const response = await fetch(`https://readybutton.herokuapp.com/api/button/${urlId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch button data');
        }
        const data = await response.json();
        setButtonData(data);
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
    fetchData();

    socket.on('increment', (data) => {
      snackbarOpen ? setSnackbarOpen(false) : setSnackbarOpen(true);
      dataLoaded && setButtonData({ count: data.count });
    fetchData();
    });
    socket.on('reset', (data) => {
      snackbarOpenReset ? setSnackbarOpenReset(false) : setSnackbarOpenReset(true);
      dataLoaded && setButtonData({ count: data.count });
      fetchData();
    });
  }, [urlId]);

  const animatedClick = () => {
    if (!animationRef.current) {
      animationRef.current = new mojs.Burst({
        parent: '#my-div',
        radius:   { 150: 200 },
        angle:    45,
        count:    14,
        timeline: { delay: 0 },
        children: {
          radius:       2.5,
          fill:         [
            { '#9EC9F5' : '#9ED8C6' },
            { '#91D3F7' : '#9AE4CF' },

            { '#DC93CF' : '#E3D36B' },
            { '#CF8EEF' : '#CBEB98' },

            { '#87E9C6' : '#1FCC93' },
            { '#A7ECD0' : '#9AE4CF' },

            { '#87E9C6' : '#A635D9' },
            { '#D58EB3' : '#E0B6F5' },

            { '#F48BA2' : '#CF8EEF' },
            { '#91D3F7' : '#A635D9' },

            { '#CF8EEF' : '#CBEB98' },
            { '#87E9C6' : '#A635D9' },
          ],
          scale:        { 1: 0, easing: 'quad.in' },
          pathScale:    [ .8, null ],
          degreeShift:  [ 2, null ],
          duration:     [ 500, 1000 ],
          easing:       'quint.out'
        }
      }).play();
    } else {
      animationRef.current.play();
    }
    }
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
        <div>
        <Button
            id="my-div"
            style={{
            width: '3em',
            height: '3em',
            fontSize: '90px',
            borderRadius: '9999px',
            marginBottom: '20px',
            filter: 'drop-shadow(5px 5px 10px #000)',
          }}
            disabled={clickedUsers.includes(urlId)}
          color='primary'
          variant='contained'
          onClick={handleClick}
            backgroundColor='primary'
        >
          {clickedUsers.includes(urlId) && <div className="completedClick"></div>}

          {!dataLoaded ? (
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
            {emojiVisible && <div>
              </div>}
      </div>
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
            Someone clicked the button!
          </Alert>
        </Snackbar>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            open={snackbarOpenReset}
            onClose={() => setSnackbarOpenReset(false)}>
          <Alert severity='error' sx={{ width: '100%' }}>
            Button count reset!
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
}
