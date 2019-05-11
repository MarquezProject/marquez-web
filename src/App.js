import React, { Component } from 'react';
import './App.css';
import MainContainer from './components/MainContainer'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2B2B33'
    },
    secondary: {
      main: '#006BA0'
    }
  },
});
console.log(grey[900])

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <MainContainer/>
      </MuiThemeProvider>
    );
  }
}

export default App;
