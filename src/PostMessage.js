import { useEffect, useState } from "react";
import { Button, Popover, Skeleton } from "@mui/material";

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
            backgroundColor: "rgba(164,164,164,0.16)",
            borderRadius: "5px"
          }}
        >
          <Skeleton variant={"rectangular"} width={100} height={50} />
        </div>)}
      <div style={{ display: loading ? "none" : "block" }}>
        {currentButtonOwner === currentUser && (
          <div
            style={{
              position: "fixed",
              top: "12px",
              left: "20px",
              backgroundColor: "white",
              borderRadius: "5px"
            }}
          >
            <Button
              variant="contained"
              onClick={handleClick}
              style={{
                backgroundColor: "rgba(164,164,164,0.16)",
                color: "#fff"
              }}
            >
              Post a message
            </Button>
            <Popover
              sx={{ padding: "20px" }}
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
              <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "400px", height: "30px", padding: "10px", borderRadius: "5px", border: "1px solid black",
                fontSize: "16px", fontFamily: "sans-serif", outline: "none", backgroundColor: "white",
                color: "black", margin: "10px"
              }}
            />
                <button type="submit">Post</button>
              </form>
              {message.length > 0 && (
                <div>
                  <div>{message}</div>
                </div>
              )}
            </Popover>
          </div>
        )}
      </div>
      {loading && <Skeleton />}
      {message.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "115px",
            display: "flex",
            minWidth: "400px",
            backgroundColor: "#92979fc7",
            borderRadius: "5px",
            padding: "10px"
          }}
        >
          <div>{message}</div>
        </div>
      )}
    </>
  );
}

export default PostMessage;
