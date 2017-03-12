import React, { Component } from 'react';
import InputRange from 'react-input-range';
import _ from 'lodash';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Genres from '../Genres';
import './MovieDisplay.sass';

export default class MenuMovies extends Component {

  state = {
    bcolor: '#363637',
    genreButton: 'buttonList',
    operatorGenre: '+',
  }

componentDidMount = () => {
  console.log('dsvsdvdsvds', this.props);
}

colorGenre = (e) => {
 let bColor = '#'+Math.floor(Math.random()*16777215).toString(16);
 this.setState({bcolor: bColor})
  e.target.style.backgroundColor = bColor;
  // console.log(e.target.parentNode.parentNode);
}

resetDiv = (e) =>{
  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
}


resetColor = (e) =>{
  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
}

displayMenu = (e) => {
  this.state.genreButton === 'genreButton' ? this.setState({ genreButton: 'buttonList', operatorGenre: '+' }) : this.setState({ genreButton: 'genreButton', operatorGenre: '-' }) ;
}

all = () => (
  <button
    className={this.state.genreButton}
    onClick={() => this.props.onChange('genre', '')}
    onMouseOut={this.resetColor}
    onMouseOver={this.colorGenre}
    style={{
      margin : '2px',
    }}>
    All
    </button>
)

  render(){
    // const {current} = this.props.translation;
    const { genreButton } = this.state;
    return(
        <div>
        <p className="genreTitle" onClick={this.displayMenu}>
        {this.state.operatorGenre} GENRES</p>
          {this.all()}
          {Genres.map((genre, key) => {
            return(
              <div key={key}>
                <button
                  className={genreButton}
                  onClick={() => this.props.onChange('genre', genre)}
                  onMouseOut={this.resetColor}
                  onMouseOver={this.colorGenre}
                  style={{
                    margin : '2px',
                  }}>
                    {genre}
                  </button>
              </div>
            )
          })}
      </div>
    )
  }
}