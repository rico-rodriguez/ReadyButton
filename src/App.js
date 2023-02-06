import { BrowserRouter, Route, Routes } from "react-router-dom";

import ButtonClicker from "./ButtonClicker";
import Home from "./Home";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { AnimatedRoute } from "react-router-transition";

const theme = createTheme({
  palette: {
    primary: {
      foreground: "#000000",
      main: "#fff"
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff"
    },
    root: {
      background: "red"
    }
  },
  components: {
// Name of the component
    MuiCircularProgress: {
      defaultProps: {
        thickness: 1.6
      },
      styleOverrides: {
        circle: {
          color: "#58c549"
        }
      }
    }
  }
});

function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("username")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <AnimatedRoute
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route path="/" element={<Home />} />
            {/*<Route path="/login" element={<LoginPage />} />*/}
            {loggedIn && <Route path="/:urlId" element={<ButtonClicker />} />}
          </AnimatedRoute>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
