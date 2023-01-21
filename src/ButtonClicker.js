import React, { useState, useEffect, useRef } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
import UserControl from "./UserControl";
const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com', {
  withCredentials: true,
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

  const navigate = useNavigate();
  useEffect(() => {
    // check for cookie
    const cookie = document.cookie;
    if (!cookie) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchUserId() {
      // Make a request to your server to get the user's ID
      const response = await fetch(
        'https://readybutton.herokuapp.com/api/user/id',
        {
          headers: {
            'Access-Control-Allow-Origin': '*', // This is required for CORS support to work
            'Access-Control-Allow-Credentials': 'true', // This is required for cookies, authorization headers with HTTPS

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
    setEmojiVisible(true);
    {
      animatedClick();
    }
    setTimeout(() => {
      setEmojiVisible(false);
    }, 3000);
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
                'Access-Control-Allow-Credentials': 'true',
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
          headers: { 'Content-Type': 'application/json'
          , 'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',},
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
        const response = await fetch(
          `https://readybutton.herokuapp.com/api/button/${urlId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              userId: userId,
              'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            credentials: 'include',
          }
        );
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
      snackbarOpenReset
        ? setSnackbarOpenReset(false)
        : setSnackbarOpenReset(true);
      dataLoaded && setButtonData({ count: data.count });
      fetchData();
    });
  }, [urlId]);
  class Heart extends mojs.CustomShape {
    getShape() {
      return '<path d="M73.6170213,0 C64.4680851,0 56.5957447,5.53191489 51.7021277,13.8297872 C50.8510638,15.3191489 48.9361702,15.3191489 48.0851064,13.8297872 C43.4042553,5.53191489 35.3191489,0 26.1702128,0 C11.9148936,0 0,14.0425532 0,31.2765957 C0,48.0851064 14.893617,77.8723404 47.6595745,99.3617021 C49.1489362,100.212766 50.8510638,100.212766 52.1276596,99.3617021 C83.8297872,78.5106383 99.787234,48.2978723 99.787234,31.2765957 C100,14.0425532 88.0851064,0 73.6170213,0 L73.6170213,0 Z"></path>';
    }
  }
  mojs.addShape('heart', Heart);
  const animatedClick = () => {
    if (!animationRef.current) {
      animationRef.current = new mojs.Burst({
        parent: '#my-div',
        radius: { 150: 200 },
        angle: 45,
        count: 40,
        timeline: { delay: 300 },
        children: {
          radius: 4.5,
          fill: [
            // { '#91D2FA' : '#BDEFD8' },
            // { '#91D2FA' : '#ADD6CA' },
            { '#9EC9F5': '#9ED8C6' },
            { '#91D3F7': '#9AE4CF' },

            { '#DC93CF': '#E3D36B' },
            { '#CF8EEF': '#CBEB98' },

            { '#87E9C6': '#1FCC93' },
            { '#A7ECD0': '#9AE4CF' },

            { '#87E9C6': '#A635D9' },
            { '#D58EB3': '#E0B6F5' },

            { '#F48BA2': '#CF8EEF' },
            { '#91D3F7': '#A635D9' },

            { '#CF8EEF': '#CBEB98' },
            { '#87E9C6': '#A635D9' },
          ],
          scale: { 1: 0, easing: 'quad.in' },
          pathScale: [0.8, null],
          degreeShift: [13, null],
          duration: [500, 700],
          easing: 'quint.out',
          speed: 0.7,
        },
      }).play();
      const CIRCLE_RADIUS = 150;
      animationRef.current = new mojs.Shape({
        parent: '#my-div',
        stroke: { '#344c6a': '#d5cccc' },
        strokeWidth: { [45]: 0 },
        fill: 'none',
        scale: { 0: 1 },
        duration: 400,
        radius: CIRCLE_RADIUS,
        easing: 'cubic.out',
      }).play();
      // animationRef.current = new mojs.Shape({
      //   parent: '#my-div',
      //   shape: 'heart',
      //   fill: '#E5214A',
      //   scale: { 0: 1 },
      //   duration: [1000],
      //   radius: 70,
      //   easing: 'elastic.out',
      //   delay: 300,
      //   isShowEnd: false,
      // }).play();
      // setTimeout(() => {
      //   animationRef.current.stop();
      // }, 3000);
    }
  };
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
            id='my-div'
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
          >
            {clickedUsers.includes(urlId) && (
              <div className='completedClick'></div>
            )}

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
          {emojiVisible && <div></div>}
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
          onClose={() => setSnackbarOpenReset(false)}
        >
          <Alert severity='error' sx={{ width: '100%' }}>
            Button count reset!
          </Alert>
        </Snackbar>
      </Grid>
      <UserControl />

    </div>
  );
}
