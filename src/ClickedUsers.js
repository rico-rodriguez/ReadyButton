import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

export default function ClickedUsers() {
  const [clickedUsers, setClickedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);


  useEffect(() => {
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
            Authorization: `Bearer ${currentUser}`
          },
          credentials: "include",
          withCredentials: true
        }
      );
      const data = await response.json();
      setClickedUsers(data);
      const usersList = data.usersArray.map((user) => (
        <li key={user}>{user}</li>
      ));
      setUsersList(usersList);
    }, 1000);
  }, []);
  useEffect(() => {
    if (clickedUsers.usersArray) {
      const usersList = clickedUsers.usersArray.slice(1).map((user) => (

        <li className="featureItem" key={user}>{user}</li>
      ));
      setUsersList(usersList);
    }
  }, [clickedUsers]);

  return (
    <>
      {!clickedUsers.usersArray && (
        <div
          style={{
            position: "fixed",
            top: "115px",
            right: "20px",
            backgroundColor: "rgba(0,0,0,0.79)",
            borderRadius: "5px",
            height: "540px",
            width: "170px"
          }}
        >
          <Skeleton sx={{ backgroundColor: "#494949", zIndex: "999" }} animation={"pulse"} variant="rect" width={170}
                    height={540} />
        </div>)}
      {clickedUsers.usersArray && (
        <div
          style={{
            position: "fixed",
            top: "115px",
            right: "20px",
            backgroundColor: "rgba(255,255,255,0.52)",
            borderRadius: "5px",
            padding: "20px",
            overflow: "hidden",
            height: "500px",
            width: "130px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            fontFamily: "Roboto"
          }}
        >
          Admin: {clickedUsers.usersArray[0]}
          <hr />
          <ul className="featureList">{usersList}</ul>
        </div>
      )}
    </>
  );
}
