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
    this.props.hideChart();
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

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
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });

    this.props.handler(e, e.currentTarget.innerText);
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

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
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
        <Form>
        <Form.Group controlId="formBasicDisease">
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