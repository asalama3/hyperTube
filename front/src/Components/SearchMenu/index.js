import React, { Component } from 'react';

export default class SearchMenu extends Component {
  state={
    search: '',
    title: '',
  }

  handleChangeSearch = (e) => {
    if(this.props.onChange){
      if(e.target.value === ''){
        this.props.onChange()
      }
    }
    console.log('valeur state', e.target.value);
    this.setState({ search: e.target.value });
  }

  submit = (event) => {
    if (event.keyCode === 13) {
      this.props.onKeyDown('title', this.state.search);
    }
  }

  render(){
    return(
      <div className="searchContainer">
        <input type="text" className="Search" name="search" placeholder="Search..." onKeyDown={this.submit} onChange={this.handleChangeSearch}></input>
      </div>
    )
  }
}