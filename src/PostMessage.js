import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

function PostMessage() {
  const [message, setMessage] = useState("");
  const [currentButtonOwner, setCurrentButtonOwner] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);

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

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Send the message to the server via Socket.io
    sendMessage(message);
    console.log(message, currentUser);
    setMessage("");
    handleClose();
  }

  function sendMessage(messageData) {
    socket.emit("new message", messageData);
    console.log(messageData + "log after emit");
  }

  return (
    <>
      {currentButtonOwner === currentUser && (
        <>
          <Button onClick={handleOpen}>Post message</Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Post</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {message.length > 0 && (
        <div
          style={{
            display: "flex",
            minWidth: "400px",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <div>Message: {message}</div>
        </div>
      )}
    </>
  );
}

export default PostMessage;