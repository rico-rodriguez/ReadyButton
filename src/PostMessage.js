import { useEffect, useState } from "react";
import { Button, Popover, Skeleton } from "@mui/material";
import Tooltip from "@material-ui/core/Tooltip";

const io = require("socket.io-client");
const socket = io("https://readybutton.herokuapp.com", {
  withCredentials: true
});

function PostMessage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentButtonOwner, setCurrentButtonOwner] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Listen for new messages from the server
    socket.on("new message", (message) => {
      setMessage(message);
    });
    setCurrentUser(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      const fetchUsers = async () => {
        const urlId = window.location.pathname.substring(1);
        // Fetch the list of users from the server
        const response = await fetch(
          `https://readybutton.herokuapp.com/api/users?urlId=${urlId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
              Authorization: `Bearer ${currentUser}`
            },
            credentials: "include",
            withCredentials: true
          }
        );
        const data = await response.json();
        setCurrentButtonOwner(data.usersArray[0]);
        setLoading(false);
      };
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    // Send the message to the server via Socket.io
    sendMessage(message);
    setMessage("");
  }

  function sendMessage(messageData) {
    socket.emit("new message", messageData);
  }


  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "12px",
            left: "20px",
            borderRadius: "5px"
          }}
        >
          <Skeleton sx={{ backgroundColor: "#949494", zIndex: "999" }}
                    variant={"rectangular"} animation={"pulse"} width={100} height={50} />
        </div>)}
      {!loading &&
        currentButtonOwner === currentUser && (
          <div
            style={{
              position: "fixed",
              top: "12px",
              left: "20px",
              backgroundColor: "rgba(164,164,164,0.16)",
              borderRadius: "5px"
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClick}
              style={{
                backgroundColor: "rgba(164,164,164,0.16)",
                color: "#fff",
                width: "100px",
                height: "50px",
                margin: "5px"
              }}
            >
              Post a message
            </Button>
            <Popover
              sx={{
                padding: "20px"
              }}
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <form style={{ padding: "10px", display: "flex", alignItems: "center", backgroundColor: "#787d88" }}
                    onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "400px", height: "30px", padding: "10px", borderRadius: "5px", border: "1px solid black",
                fontSize: "16px", fontFamily: "sans-serif", outline: "none", backgroundColor: "rgb(79, 84, 94)",
                color: "black", margin: "10px"
              }}
            /> <Tooltip title="You will have to post the message again for users who join late" arrow>

                <button style={{ fontSize: "1.5rem", margin: "0", backgroundColor: "#343637" }} type="submit">Send
                </button>
              </Tooltip>
              </form>
            </Popover>
          </div>
        )}
      {message.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "115px",
            display: "flex",
            minWidth: "400px",
            backgroundColor: "#92979fc7",
            borderRadius: "5px",
            padding: "10px",
            justifyContent: "center"
          }}
        >
          <div>{message}</div>
        </div>
      )}
    </>
  );
}

export default PostMessage;
