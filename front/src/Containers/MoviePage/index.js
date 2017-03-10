import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MoviePage from '../../Components/MoviePage';
import Header from '../../Components/Header';

const Movie = ({ translation, actions, id, movies }) =>
  <div>
    <Header/>
    <MoviePage movies={movies} id={id} translation={translation} actions={actions} />
  </div>

//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

// query: ownProps.location.query

const mapStateToProps = (state, ownProps, movies) => ({
  translation: state.translation,
  id: ownProps.params.id,
  movies: state.movies,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
