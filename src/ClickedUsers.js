import React, { useState, useEffect } from "react";

export default function ClickedUsers() {
  const [clickedUsers, setClickedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("username");
    const urlId = window.location.pathname.split("/")[1];
    async function getUsers() {
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
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (clickedUsers.usersArray) {
      const usersList = clickedUsers.usersArray.map((user) => (
        <li key={user}>{user}</li>
      ));
      setUsersList(usersList);
    }
  }, [clickedUsers]);

  return (
    <>
      {clickedUsers.usersArray && (
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
