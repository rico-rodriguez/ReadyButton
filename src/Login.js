import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";

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
              "Access-Control-Allow-Credentials": "true",
            },
            credentials: "include",
            withCredentials: true,
            body: JSON.stringify({ username: name }),
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
          "Access-Control-Allow-Credentials": "true",
        },
        credentials: "include",
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        position: "fixed",
        bottom: "0px",
        width: "100%",
        height: "20px",
        backgroundColor: "rgba(255,255,255,0.62)",
        borderRadius: "5px",
        padding: "10px",
        zIndex: "0",
      }}
    >
      {isLoggedIn ? (
        <div>
          <span><p>Welcome, {userName}</p>
          <Button
            size="small"
            variant="outlined"
            onClick={Logout}
            style={{
              color: "#010202",
              display: "block",
              width: "100%",
            }}
          >
            Log Out
          </Button></span>
        </div>
      ) : (
        <FormControl>
          <InputLabel style={{ color: "black" }} htmlFor="my-input">
            User Name
          </InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            value={name}
            onChange={handleChange}
          />
          <FormHelperText id="my-helper-text" style={{ color: "black" }}>
            Enter Your User Name
          </FormHelperText>
          <Button
            onClick={handleSubmit}
            style={{ color: "#010202", display: "block", width: "100%" }}
          >
            Log In
          </Button>
        </FormControl>
      )}
    </div>
  );
}
