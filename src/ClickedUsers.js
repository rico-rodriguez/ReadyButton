import React, { useState, useEffect } from "react";

export default function ClickedUsers() {
  const [clickedUsers, setClickedUsers] = useState([]);

  useEffect(async () => {
    const urlId = window.location.pathname.split("/")[1];
    const response = await fetch(
      `https://readybutton.herokuapp.com/api/users?urlId=${urlId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        credentials: "include",
        withCredentials: true,
      }
    );
    const data = await response.json();
    setClickedUsers(data);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "10px",
          overflow: "scroll",
          height: "500px",
        }}
      >
        {/*Create an unordered list of all users in the usersArray*/}
        <ul>
          {clickedUsers.map(clickedUsers.usersArray)} => (
          <li key={clickedUsers.usersArray}>{clickedUsers.usersArray}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
