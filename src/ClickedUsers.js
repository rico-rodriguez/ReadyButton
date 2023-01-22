import React, { useState, useEffect } from "react";

export default function ClickedUsers() {
  const [clickedUsers, setClickedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(async () => {
    const currentUser = localStorage.getItem("username");
    const urlId = window.location.pathname.split("/")[1];
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
    setClickedUsers(data);
    const usersList = data.usersArray.map((user) => <li key={user}>{user}</li>);
    setUsersList(usersList);
  }, []);

  return (
    <>
      {clickedUsers.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "rgba(255,255,255,0.52)",
            borderRadius: "5px",
            padding: "10px",
            overflow: "scroll",
            height: "500px",
            width: "200px",
          }}
        >
          <ul>{usersList}</ul>
        </div>
      )}
    </>
  );
}
