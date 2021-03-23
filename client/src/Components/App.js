import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './Index/Home';
import Application from './Application/Timetable';
import Particles from 'react-particles-js';
import Chart from './Application/Chart';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return (
      <section>
        <Particles
          params={{
            particles: {
              enable: true,
              move: {
                radius: 10
              },
            },
            color : {
              value : "#15151e"
            }
          }} />
        <Router>
          <Switch>
            <Route exact path="/"  component={() => <Home />} />
            <Route path="/App" component={() => <Application />} />
            <Route path="/Chart/:id" component={() => <Chart />} />
          </Switch>
        </Router>
      </section>

    )
  }
}

export default App;

