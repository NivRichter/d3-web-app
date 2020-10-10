import React, { Component } from "react";
import "./App.css";
import Graph from "./Graph.js";
import Autocomplete from "./Autocomplete.jsx";



import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

import {
  Button,
  Container,
  Row,
  Col,
  Fade,
  Table,
  ListGroup,
} from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.AutoCompleteHandler = this.AutoCompleteHandler.bind(this);
    this.hideChart = this.hideChart.bind(this);
    this.state = {
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
  AutoCompleteHandler(e, val) {
    this.setState({
      disease: val,
      value: val
    });
  }
  componentDidMount() {
    console.log("mounting APP");
    let url = "https://api.jsonbin.io/b/5f74bd117243cd7e824742f6";
    fetch(url, {
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
        this.getDiseases(data);
      });

    url = "https://api.jsonbin.io/b/5f762e2c7243cd7e82484f0c";
    fetch(url, {
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

  getDiseases(data) {
    var diseases = [];
    for (var d in data) {
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
  }

  render() {
    return (

        <Container fluid 
        style={ {backgroundImage: "url(https://eskipaper.com/images/high-res-abstract-backgrounds-1.jpg)"}}
         >
          {/******************* Site Header  ********************/}
          <Row  >
                {/******************* LOGO  ********************/}

                <Col md={3} xs={12}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Ben-Gurion_University_of_the_Negev.svg/1200px-Ben-Gurion_University_of_the_Negev.svg.png"
                    alt ="" style={{ height:"150px", width: "150px", paddingTop:"10px" }}
                  />
                </Col>

                {/******************* Header and Search Bar  ********************/}

                <Col md={6} xs={12}>
                 
                    <h1
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontFamily: "Arial Black",
                        color: "white"
                      }}
                    >
                      Disease - Protein - Drug{" "}
                  </h1>
                      <br/>
               
                  <Row   className="justify-content-center"     >
                    <Col md={5} xs={8}
                    style={{paddingRight:"0px"}}>
 
                      <Autocomplete
                        suggestions={this.state.diseases}
                        handler={this.AutoCompleteHandler}
                        hideChart={this.hideChart}
                      />               
                      </Col >

                      <Col md={1} xs={3}
                                        style={{paddingLeft:"0px"}}
                                                >
                   
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

                   
                  </Row>
                </Col >
                {/******************* Legend  ********************/}

                <Col xs={3}>
                <Fade in={this.state.open}>

                         <Table
                          style={{
                            marginTop:"50px",
                            height: "auto",
                            width:"200px",
                            color: "white",
                            fontSize: "19px",
                            display: "flex",
                            justifyContent: "center",
                                  }}>

                            {
                              this.state.view ? 
                                    <tbody>
                                      <tr >
                                        <td className="r-cl" >Disease</td>
                                      </tr>
                                      <tr >
                                        <td className="c-p-cl">Protein</td>
                                      </tr>
                                      <tr>
                                        <td  className="c-d-cl">Drug</td>
                                      </tr>
                                    </tbody>
                                        : null
                           }

                        </Table> 
              </Fade>
            </Col>

          </Row>

          {/******************* END OF Header  ********************/}

          {/*******************Graph Chart ********************/}

          <Row style={{marginTop:"20px", width:"100%"}}>
            <Col style={{width:"100%"}}>
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
    );
  }
}

export default App;
