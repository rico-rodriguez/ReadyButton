import { Button, CircularProgress, FormControl, Input, InputLabel } from "@mui/material";
import React, { useEffect } from "react";

export default function Login() {
  const [name, setName] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

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
    if (name === "") {
      return;
    }
    setIsLoading(true);
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
          setIsLoading(false);
          localStorage.setItem("username", data.username);
        } else {
          console.log("Error logging in");
          setIsLoading(false);

        }
      } catch (err) {
        console.error("Error logging in:", err);
        setIsLoading(false);

      }
    } else {
      console.log("Already logged in");
      setIsLoading(false);
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

  let loadingGif = "/spin.gif";
  return (
    <div
      style={{
        position: "sticky",
        top: "0px",
        backgroundColor: "rgba(0,0,0,0.27)",
        borderRadius: "5px",
        padding: "10px",
        zIndex: "0",
        color: "white",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        {isLoading ? <CircularProgress size={50} color="secondary" />
          : null}
      </div>
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
            color: "white",
            display: "flex",
            flexDirection: "row"
          }}>
          <InputLabel style={{ color: "#fff" }} htmlFor="my-input">
            User Name
          </InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            value={name}
            onChange={handleChange}
            style={{ color: "#FFF" }}
          />
          <Button
            outline
            color="success"
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
