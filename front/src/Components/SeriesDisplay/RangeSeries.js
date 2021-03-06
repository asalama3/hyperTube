import React, { Component } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './sass/SeriesDisplay.sass';

export default class RangeSeries extends Component {
  state = {
    year: {
      min: 1900,
      max: 2017,
    },
    rate: {
      min: 0,
      max: 10,
    }
  }

  handleChangeYear = (values) => {
    this.setState({ year: values });
  }

  handleChangeYearToProps = () => {
    this.props.onChange('year', this.state.year);
  }

  handleChangeRating = (values) => {
    this.setState({ rate: values });
  }

  handleChangeRatingToProps = () => {
    this.props.onChange('rate', this.state.rate);
  }

  render(){
    return(
      <div className="ranges">
        <InputRange
          maxValue={2017}
          minValue={1900}
          value={this.state.year}
          onChangeComplete={this.handleChangeYearToProps}
          onChange={this.handleChangeYear}
        />
        <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.rate}
          onChange={this.handleChangeRating}
          onChangeComplete={this.handleChangeRatingToProps}
        />
      </div>
    )
  }
}
