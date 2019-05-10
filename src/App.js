import React, { Component } from 'react';
import './App.css';
import MainContainer from './components/MainContainer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNamespace: null,
      namespaces: []
    }
    this.nsChangeHandler = this.nsChangeHandler.bind(this);
  }

  nsChangeHandler(selectedNs) {
    this.setState({selectedNamespace: selectedNs})
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <MainContainer/>
      </div>
    );
  }
}

export default App;
