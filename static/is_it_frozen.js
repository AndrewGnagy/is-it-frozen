'use strict';
import state_fips from './state_fips.js'

const e = React.createElement;

class IsItFrozen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tempData: [], stationData: [] };
  }

  handleStation = (changeEvent) => {
    console.log(changeEvent.target.value);
    fetch("/temps/" + changeEvent.target.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          tempData: result.results
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  handleFips = (changeEvent) => {
    console.log(changeEvent.target.value);
    fetch("/stations/" + changeEvent.target.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          stationData: result.results
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render() {
    let divContents = [];
    if (this.state.tempData && this.state.tempData.length > 0) {
      // Estimate 1.2mm of ice per frozen degree days. NOAA results are in tenths of degrees C
      let fdd = this.state.tempData.reduce((acc, datum) => {
        acc += datum.value;
        return acc < 0 ? acc : 0;
      });
      console.log(fdd);
      let icecm = -.12 * (fdd / 10);
      if (icecm > 0) {
        divContents.push(React.createElement("h3", {}, icecm + "cm of ice"));
      } else {
        divContents.push(React.createElement("h3", {}, "Ice is not frozen"));
      }
    } else if (this.state.stationData && this.state.stationData.length > 0) {
      let stationOptions = [React.createElement("option", {disabled: true, value: "-1"}, "Select your closest NOAA Station")];
      this.state.stationData.forEach((station) => {
        stationOptions.push(React.createElement("option", {value: station.id}, station.name));
      });
      divContents.push(React.createElement("select", {onChange: this.handleStation, defaultValue: "-1"}, ...stationOptions));
    } else {
      let options = [React.createElement("option", {disabled: true, value: "-1"}, "Select a state")];
      state_fips.forEach((fip) => {
        options.push(React.createElement("option", {value: fip.id}, fip.name));
      });
      divContents.push(React.createElement("select", {onChange: this.handleFips, defaultValue: "-1"}, ...options));
    }
    return React.createElement("div", {}, ...divContents);
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(IsItFrozen), domContainer);