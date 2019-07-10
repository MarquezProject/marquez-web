import React, { Component } from "react";
import "./App.css";
import MainContainer from "./components/MainContainer";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import store from "./components/store";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2B2B33"
    },
    secondary: {
      main: "#006BA0"
    }
  }
});

const TITLE = "Marquez | Data Kit";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <MainContainer store={store} />
      </MuiThemeProvider>
    );
  }
}

export default App;
