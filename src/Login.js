import { Button, FormControl, Input, InputLabel } from "@mui/material";
import React, { useEffect } from "react";

export default function Login() {
  const [name, setName] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
      setUserName(username);
    } else {
      setIsLoggedIn(false);
    }
  }, [userName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem("username")) {
      try {
        const response = await fetch(
          "https://readybutton.herokuapp.com/login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
            credentials: "include",
            withCredentials: true,
            body: JSON.stringify({ username: name })
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn);
          setUserName(data.username);
          localStorage.setItem("username", data.username);
        } else {
          console.log("Error logging in");
        }
      } catch (err) {
        console.error("Error logging in:", err);
      }
    } else {
      console.log("Already logged in");
    }
  };

  async function Logout() {
    try {
      await fetch("https://readybutton.herokuapp.com/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
        credentials: "include"
      });
      localStorage.clear();
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Error logging out:", err);
    }
    window.location.replace("/");
    return window.location.assign("/");
  }

  return (
    <div
      style={{
        position: "sticky",
        top: "0px",
        width: "99%",
        height: "fit-content",
        backgroundColor: "rgba(0,0,0,0.79)",
        borderRadius: "5px",
        padding: "10px",
        zIndex: "0",
        color: "white",
        left: "93%",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {isLoggedIn ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
        }}>
          <p>Welcome, {userName}</p>
          <Button
            size="small"
            variant="text"
            onClick={Logout}
            style={{
              color: "white",
              position: "absolute",
              right: "10px"
            }}
          >
            Log Out
          </Button>
        </div>
      ) : (
        <FormControl
          style={{
            color: "white"
          }}>
          <InputLabel style={{ color: "#fff" }} htmlFor="my-input">
            User Name
          </InputLabel>
          {/*<FormHelperText id="my-helper-text" style={{ color: "red" }}>*/}
          {/*  Enter Your User Name*/}
          {/*</FormHelperText>*/}
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            value={name}
            onChange={handleChange}
            style={{ color: "#FFF" }}
          />
          <Button
            contained
            onClick={handleSubmit}
            style={{ color: "#FFF" }}
          >
            Log In
          </Button>
        </FormControl>
      )}
    </div>
  );
}
