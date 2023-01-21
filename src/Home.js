import {Box, Checkbox, Container, css, Typography} from '@mui/material';
import * as PropTypes from "prop-types";
import Login from "./Login";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com/', {
  withCredentials: false,
});
socket.on('connect', () => {
  socket.emit('connection', null);
});

function CustomCheckbox(props) {
  const { checked, onChange, ...other } = props;

return (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            '& > :not(style)': { m: 1 },
        }}
  >
    <Checkbox
        checked={checked}
        onChange={onChange}
        {...other}
    />
    <Typography variant="body2" color="text.secondary">
        {props.label}
    </Typography>
    </Box>
    );
}
CustomCheckbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.any
};
export default function Home() {
  return (
      <>
        <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
        >

          <Container maxWidth='sm' style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center',
            justifyItems: 'space-between',
            alignItems: 'space-between',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.5)',
            boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            borderRadius: '5px',
            fontFamily: 'Open Sans, sans-serif',
            margin: 'auto',
            marginTop: '10px',
            marginBottom: '10px',
            height: '100%',
            zIndex: 999,
          }}>
            <Typography variant='h2' style={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'white',
              padding: '20px',
              textAlign: 'center',
              fontSize: '4rem',
            }}>
              Welcome
            </Typography>
            <Box style={{
              backgroundColor: 'rgba(96,96,96,0.15)',
              color: '#eeeeee',
              padding: '20px',
              fontFamily: 'Source Code Pro, monospace',
              fontSize: '14px',
              borderRadius: '5px',
            }}>
              <Typography variant='subtitle1'>
                To get started, add anything after the '/' of this url and you
                will be sent to your own instance of the ready button. Share the
              link with classmates or friends to see when everyone is ready!
            </Typography>
          </Box>
          <div className="featureListContainer">
          <ul className="featureList">
            <li className="featureItem">
              <CustomCheckbox
                  className="customCheckbox"
                  checked={false}
                  onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Post your own question to the button header
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                  className="customCheckbox"
                  checked={false}
                  onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Back user list to db to keep track of who has clicked and release names when reset
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add a settings button that allows you to set a click limit, and
                notifies when it is reached
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                  className="customCheckbox"
                  checked={false}
                  onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add settings to turn off features
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Restrict URL's that can be made, clean periodically
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add the ability to set usernames and share username of people
                who have clicked
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={false}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate with Teams via webhooks/client bot
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add Emoji burst from cursor on click
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate websockets for incrementing button/resetting
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                  className="customCheckbox"
                  checked={true}
                  onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add Loading spinner that sends signals out via websockets
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Add Snackbar for button reset
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>Enable Reset button</Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Migrate to web and modify localhost to web addresses.
              </Typography>
            </li>
            <li className="featureItem">
              <CustomCheckbox
                className="customCheckbox"
                checked={true}
                onChange={() => {}}
              />
              <Typography variant='subtitle2'>
                Integrate websockets for snackbar notification
              </Typography>
            </li>
          </ul>
            </div>
        </Container>
      </div>
        <Login />
    </>
  );
}
