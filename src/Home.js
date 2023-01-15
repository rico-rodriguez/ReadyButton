import socketClient from 'socket.io-client';
import { Box, Checkbox, Container, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import GitHubLink from './GitHubLink';
const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com/', {
  withCredentials: false,
});
socket.on('connect', () => {
  console.log(`I'm connected with thesocket from home`);
  socket.emit('connection', null);
});

const useHomeStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    padding: theme.spacing(2),
    background: 'rgba(0, 0, 0, 0.5)',
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    borderRadius: '5px',
    fontFamily: 'Open Sans, sans-serif',
    zIndex: 999,
  },

  header: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'white',
    padding: theme.spacing(2),
    textAlign: 'center',
    fontSize: '4rem',
  },
  subheader: {
    backgroundColor: 'rgba(96,96,96,0.15)',
    color: '#eeeeee',
    padding: theme.spacing(2),
    fontFamily: 'Source Code Pro, monospace',
    fontSize: '14px',
    borderRadius: '5px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    color: 'white',
  },
  customCheckbox: {
    width: '20px',
    height: '20px',
    marginRight: '7px',
    color: '#ffffff',
    '&.Mui-checked': {
      color: '#1aa400',
    },
  },
}));

export default function Home() {
  const CustomCheckbox = withStyles(useHomeStyle())((props) => (
    <Checkbox color='default' {...props} />
  ));
  const classes = useHomeStyle();
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth='sm' className={classes.root}>
          <Typography variant='h2' className={classes.header}>
            Welcome
          </Typography>
          <Box className={classes.subheader}>
            <Typography variant='subtitle1'>
              To get started, add anything after the '/' of this url and you
              will be sent to your own instance of the ready button. Share the
              link with classmates or friends to see when everyone is ready!
            </Typography>
          </Box>
          <ul className={classes.featureList}>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate Webhooks for incrementing button/resetting
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add a settings button that allows you to set a click limit, and
                notifies when it is reached
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add Emoji burst from cursor on click
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Restrict URL's that can be made, clean periodically
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add Snackbar for button reset
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add the ability to set usernames and share username of people
                who have clicked
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate with Teams via webhooks/client bot
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>Enable Reset button</Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Migrate to web and modify localhost to web addresses.
              </Typography>
            </li>
            <li className={classes.featureItem}>
              <CustomCheckbox
                className={classes.customCheckbox}
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate webhooks for snackbar notification
              </Typography>
            </li>
          </ul>
        </Container>
      </div>
      <GitHubLink />
    </>
  );
}
