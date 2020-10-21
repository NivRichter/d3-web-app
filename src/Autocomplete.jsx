import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  Form,

} from "react-bootstrap";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: ""
    };
  }

  onChange = (e) => {
    e.preventDefault();

    this.props.showChart(false);
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    if (suggestions.length === 0) {
      this.setState({
        activeSuggestion: 1,
        filteredSuggestions:['Loading...'],
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }
    else {
      // Filter our suggestions that don't contain the user's input
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) === 0
      );

      this.setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }
 
  };

  onClick = (e) => {
    e.preventDefault();

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
      },
      function(){
        this.props.handler(this.state.userInput);
      }
    );

  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }

  };

  enterKeyPressed = (e) => {
    e.preventDefault()
    console.log('key preseed')
    const { activeSuggestion, filteredSuggestions } = this.state;

    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      userInput: filteredSuggestions[activeSuggestion]
    });
    console.log(`userinput in autocomplete ${this.state.userInput}`)
    this.props.handler(this.state.userInput,true);
    this.props.showChart(true);


  };


  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      enterKeyPressed,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ListGroup className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <ListGroup.Item className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        );
      } else {
        suggestionsListComponent = (
          <ListGroup className="no-suggestions">
            <ListGroup.Item>No suggestions, you're on your own!</ListGroup.Item>
          </ListGroup>
        );
      }
    }

  
    return (
      <Fragment                             
      >
        <Form                         onSubmit={enterKeyPressed }
    >
        <Form.Group controlId="formBasicDisease"             >
           <Form.Control type="text" placeholder="Enter disease name (i.e COVID-19)" 
            type="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
            
          />
        {suggestionsListComponent}
        </Form.Group>
        </Form>
      </Fragment>
    );
  }
}

export default Autocomplete;
