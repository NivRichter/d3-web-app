  
import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {userInput: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChange(event) {
        this.setState({userInput: event.target.value});
      }
    
      handleSubmit(event) {
        alert('A name was submitted: ' + this.state.userInput);
        event.preventDefault();
      }
    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.userInput} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            <a href="https://jsonbin.io/5f74766c65b18913fc56e2c2">Data</a> |
          </form>
        );
      }

}
export default Navbar;