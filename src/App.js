import React, { Component } from "react";
import "./App.css";
import Graph from "./Graph.js";
import Autocomplete from "./Autocomplete.jsx";

import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

import RangeSlider from "react-bootstrap-range-slider";
import {
  Button,
  Container,
  Form,
  Card,
  Row,
  Col,
  Navbar,
  Fade
} from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.hideChart = this.hideChart.bind(this);
    this.state = {
      userName: "Barak",
      value: "",
      disease: "",
      jsonData: {},
      jsonDrugs: {},
      drugs: [],
      view: false,
      open: false
    };
  }

  hideChart() {
    this.setState({
      view: false,
      open: false
    });
  }
  handler(e, val) {
    this.setState({
      disease: val,
      value: val
    });
  }
  componentDidMount() {
    console.log("mounting APP");
    let url = "https://api.jsonbin.io/b/5f74bd117243cd7e824742f6";
    const response = fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "secret-key":
          "$2b$10$ySWzEs3S9JUHfDfnYERQc.EsFmQlIYLt5Jab9bvVm3zU6g1dvMJ8m"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => ({ jsonData: data }));
        this.getDiseases();
      });

    url = "https://api.jsonbin.io/b/5f762e2c7243cd7e82484f0c";
    const response2 = fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "secret-key":
          "$2b$10$ySWzEs3S9JUHfDfnYERQc.EsFmQlIYLt5Jab9bvVm3zU6g1dvMJ8m"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => ({ jsonDrugs: data }));
      });
  }

  getDiseases() {
    var diseases = [];
    for (var d in this.state.jsonData) {
      diseases.push(d);
    }

    this.setState((prevState) => ({
      diseases: diseases
    }));
  }

  onInput(e) {
    e.preventDefault();

    this.setState({
      value: e.target.value,
      view: false,
      open: false
    });
    console.log("key");
  }

  getData() {
    let proteins = this.state.jsonData[this.state.value];
    var drugs = {};
    for (var prot in proteins) {
      drugs[proteins[prot]] = this.state.jsonDrugs[proteins[prot]];
    }
    this.setState((prevState) => ({
      proteins: this.state.jsonData[this.state.value],
      disease: this.state.value,
      drugs: drugs
    }));
  }

  onEnter(e) {
    console.log("enter");
    this.getData();
    e.preventDefault();
    this.setState((prevState) => ({
      view: true,
      open: true
    }));
    //this.getData()
  }

  render() {
    let diseaseName = this.state.value;
    return (
      <body
        style={{
          backgroundImage:
            "url(https://eskipaper.com/images/high-res-abstract-backgrounds-1.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <Container fluid>
          {/******************* Site Header  ********************/}

          <Row>
            <Col>
              <Row>
                {/******************* LOGO  ********************/}

                <Col xs={1.5}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Ben-Gurion_University_of_the_Negev.svg/1200px-Ben-Gurion_University_of_the_Negev.svg.png"
                    style={{ height: "200px", width: "200px" }}
                  />
                </Col>

                {/******************* Header and Search Bar  ********************/}

                <Col xs={8}>
                  <Row>
                    <Col>
                    <h1
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontFamily: "Arial Black",
                        textShadow: "3px 6px 2px rgba(0, 0, 0, .3)",
                        color: "white"
                      }}
                    >
                      Disease - Protein - Drug{" "}
                  </h1>
                      <br/>
                    </Col>
                  </Row>
                  <Row>
                  {/*<Form style={{ paddingLeft: "200px", paddingRight: "200px" }}>*/}
                  {/*  <br />*/}
                  {/*  <Form.Group controlId="formBasicRange">*/}
                      {/* <Form.Control
                        type="text"
                        placeholder="Enter Disease Name"
                        value={diseaseName}
                        onChange={(e) => this.onInput(e)}
                        style={{ display: "flex", justifyContent: "center" }}
                      /> */}

                      <Col xs={3} style={{marginLeft:'300px'}}>
                      <Autocomplete
                        suggestions={this.state.diseases}
                        handler={this.handler}
                        hideChart={this.hideChart}
                      />
                      </Col>
                    <Col xs={1} style={{marginLeft:'50px'}}>
                      <Button
                          variant="primary"
                          className="button"
                          onClick={(e) => {
                            this.getData();
                            this.onEnter(e);
                            //  this.setState( prevState=> ({open: !this.state.open, view: true}) )
                          }}
                          aria-controls="example-fade-text"
                          aria-expanded={this.state.open}
                      >
                        {" "}
                        SUBMIT <br />
                      </Button>
                    </Col>
                      <div
                        style={{
                          height: "auto",
                          color: "white",
                          fontSize: "19px",
                          marginLeft: "200px",
                          marginTop:"60px"
                        }}
                      >
                        {this.state.view ? (
                          <p>
                            <span class="r-cl">
                              <span></span>
                            </span>
                            <b>
                              Disease<br></br>
                            </b>

                            <span class="c-p-cl">
                              <span></span>
                            </span>
                            <b>
                              Protein<br></br>
                            </b>

                            <span class="c-d-cl">
                              <span></span>
                            </span>
                            <b>Drug</b>
                          </p>
                        ) : null}
                      </div>
                      {/* <Fade in={this.state.open}>
        <div id="example-fade-text">
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
          terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
          labore wes anderson cred nesciunt sapiente ea proident.
        </div>
      </Fade> */}
                  {/*  </Form.Group>*/}

                  {/*</Form>*/}
                  </Row>
                </Col>

                {/******************* Legend  ********************/}
              </Row>
            </Col>
          </Row>

          {/******************* END OF Header  ********************/}

          {/*******************Graph Chart ********************/}

          <Row>
            <Col>
              <Fade in={this.state.open}>
                <div id="example-fade-text">
                  {
                    <Graph
                      jsonData={this.state.jsonData}
                      diseaseName={this.state.disease}
                      proteins={this.state.proteins}
                      drugs={this.state.drugs}
                    />
                  }
                </div>
              </Fade>
            </Col>
          </Row>

          {/*******************END OF Graph Chart ********************/}
        </Container>
      </body>
    );
  }
}

export default App;
