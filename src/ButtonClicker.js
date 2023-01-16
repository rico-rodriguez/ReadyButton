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
  const [buttonData, setButtonData] = useState({});
  const [clickedUsers, setClickedUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpenReset, setSnackbarOpenReset] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
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

  function animateEmoji() {
    // only call function if user has not already clicked the button
    if (!clickedUsers.includes(urlId)) {
      setEmojiVisible(true);
      setTimeout(() => {
        setEmojiVisible(false);
      }, 2000);
    }
  }
  function randomEmoji() {
    const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿",
      "🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟",
      "🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘",
      "😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫",
      "🔫","👄","🚲","🍉","💛","💚"];
    let oneEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      return oneEmoji;
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
        <div onClick={animateEmoji}>
        <Button
            id="thumbs"
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
            {/*{emojiVisible && <span className="emoji" role="img" aria-label="party popper">{randomEmoji()}</span>}*/}
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
