import { useState, useEffect } from "react";
import { Button } from "@mui/material";
const io = require("socket.io-client");
const socket = io("https://readybutton.herokuapp.com", {
  withCredentials: true,
});

function PostMessage() {
  const [message, setMessage] = useState("");
  const [currentButtonOwner, setCurrentButtonOwner] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(async () => {
    // Listen for new messages from the server
    socket.on("new message", (message) => {
      setMessage(message);
    });
    setCurrentUser(localStorage.getItem("username"));
    const urlId = window.location.pathname.substring(1);
    console.log(urlId);
    // Fetch the list of users from the server
    const response = await fetch(
      `https://readybutton.herokuapp.com/api/users?urlId=${urlId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          Authorization: `Bearer ${currentUser}`,
        },
        credentials: "include",
        withCredentials: true,
      }
    );
    const data = await response.json();
    setCurrentButtonOwner(data.usersArray[0]);
    console.log(data.usersArray[0]);
    console.log(currentButtonOwner);
    console.log(currentUser);
    if (!(currentButtonOwner === currentUser)) {
      return;
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // Send the message to the server via Socket.io
    sendMessage(message);
    console.log(message, currentUser);
    setMessage("");
  }

  function sendMessage(messageData) {
    socket.emit("new message", messageData);
    console.log(messageData + "log after emit");
  }

  return (
    <>
      {currentButtonOwner === currentUser && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
      <div
        style={{
          display: "flex",
          minWidth: "75%%",
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <div>Message: {message}</div>
      </div>
    </>
  );
}

export default PostMessage;
