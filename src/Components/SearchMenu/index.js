import React, { Component } from 'react';

export default class SearchMenu extends Component {
  state={
    search: '',
  }

  handleChangeSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  submit = (event) => {
    if (event.keyCode === 13) {
      this.props.onKeyDown('title', this.state.search);
    }
    if(event.target.value === '') {
      this.props.onKeyDown('title', '');
    }
  };

  render(){
    return(
      <div className="searchContainer">
        <input type="text" className="Search" name="search" placeholder="Search..." onKeyDown={this.submit} onChange={this.handleChangeSearch}></input>
      </div>
    )
  }
}