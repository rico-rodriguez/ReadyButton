import React, { useState, useEffect } from "react";
import PerfectScrollbar from "perfect-scrollbar";
export default function ClickedUsers() {
  const [clickedUsers, setClickedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(async () => {
    setInterval(async () => {
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
    const usersList = data.usersArray.map((user) => (
      <li key={user}>{user}</li>
    ));
    setUsersList(usersList);
    }, 3000);
  }, []);

  useEffect(() => {
    if (clickedUsers.usersArray) {
      const usersList = clickedUsers.usersArray.slice(1).map((user) => (

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
            padding: "20px",
            overflow: "hidden",
            height: "500px",
            width: "fit-content",
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            fontFamily: "Roboto",
          }}
        >
          Admin: {clickedUsers.usersArray[0]}
          <hr />
        <ul className="userList">{usersList}</ul>
        </div>
      )}
    </>
  );
}
