import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row } from 'react-bootstrap';
import RocketLaunchDetails from './components/RocketLaunchDetails';
import querystring from 'querystring';
import './App.css';
import load from './loadRocket.gif';

const API_BASE_URL = "https://api.spacexdata.com/v3/launches?limit=100";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      filters: {
        limit: 150,
        launch_year: undefined,
        launch_success: undefined,
        land_success: undefined,
      },
    };
  }

  getUpdatedApiUrl(filters = {}) {
    return API_BASE_URL + querystring.stringify({ ...filters });
  }

  fetchAPI(filters) {
    const URL = this.getUpdatedApiUrl(filters);
    this.setState({ isLoaded: false, filters });
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoaded: true,
          data
        });
      });
  }

  componentDidMount() {
    this.fetchAPI(this.state.filters);
  }

  updateApiFilters(type, value) {
    // if same value is clicked, we remove that filter
    if (this.state.filters[type] === value) {
      value = undefined;
    }

    const filters = {
      ...this.state.filters,
      [type]: value,
    };

    this.fetchAPI(filters);
  }

  render() {
    const { isLoaded, data } = this.state;
    const uniqueLaunchYears = new Array(16).fill(0).map((_, index) => 2006 + index);


    if (!isLoaded) {
      return (
        <div className="App-loader-container">
          <div className="App-loader-box">
            <img src={load} alt="loading..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <h1 className="App-header">SpaceX Launch Programs</h1>
          <div className="container">
            <div className="grid-container">
              <div>
                <Card className="App-filter-card">
                  <Card.Body>
                    <Card.Title className="App-filter-header">
                      Filters
                    </Card.Title>
                    <Card.Text className="App-filter-heading-launch-year">
                      Launch Year
                      <hr className="App-filters-hr" />
                    </Card.Text>

                    <Row>
                      <div className="App-filter-button-container">
                          {uniqueLaunchYears.map(year => {
                            return <Button className="App-filter-button"
                              variant={this.state.filters.launch_year === year.toString() ? "success" : "outline-success"}
                              value={year}
                              onClick={e => this.updateApiFilters('launch_year', e.target.value)}>
                              {year}
                            </Button>
                          })}
                        </div>
                     </Row>

                    <Card.Text className="App-filter-heading">
                      Successful Launch
                      <hr className="App-filters-hr" />
                    </Card.Text>

                    <div className="row">
                      <div className="App-filter-button-container">
                        <Button className="App-filter-button"
                          variant={this.state.filters.launch_success === "true" ? "success" : "outline-success"}
                          onClick={e => this.updateApiFilters('launch_success', e.target.value)} value="true">
                          True
                      </Button>

                        <Button className="App-filter-button"
                          variant={this.state.filters.launch_success === "false" ? "success" : "outline-success"}
                          onClick={e => this.updateApiFilters('launch_success', e.target.value)} value="false">
                          False
                      </Button>
                      </div>
                    </div>
                   
                    <Card.Text className="App-filter-heading">
                      Successful Landing
                      <hr className="App-filters-hr" />
                    </Card.Text>
                    <div className="row">
                      <div className="App-filter-button-container">
                        <Button className="App-filter-button"
                          variant={this.state.filters.land_success === "true" ? "success" : "outline-success"}
                          onClick={e => this.updateApiFilters('land_success', e.target.value)} value="true">
                          True
                      </Button>

                        <Button className="App-filter-button"
                          variant={this.state.filters.land_success === "false" ? "success" : "outline-success"}
                          onClick={e => this.updateApiFilters('land_success', e.target.value)} value="false">
                          False
                      </Button>
                      </div>
                    </div>
                    
                  </Card.Body>

                </Card>
              </div>

              <div>
                <div className="launch-container">
                  {data.map((details) => {
                    return (
                      <div className="rocket-info-container">
                        <RocketLaunchDetails details={details} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <h5 className="App-Developer-name">
                Developed by : Jasvinder Singh
              </h5>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
