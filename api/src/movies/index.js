import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Movie } from '../Schema';
import { getMovies } from '../Joi/search';

const log = require('debug')('hypertube:movies.js');

const writeJson = (allMovies) => {
  mongoose.connection.collections['movies'].drop((err) => {
      console.log('collection dropped');
  });
  allMovies = _.flattenDepth(allMovies, 1);
  allMovies.map((movie) => {
    let rate = -1;
    if (movie.rating) {
      rate = Math.floor(movie.rating);
    }
    const newMovie = new Movie({
      id: movie.id,
      imdb_code: movie.imdb_code,
      title: movie.title,
      title_search: movie.title.toLowerCase(),
      year: movie.year,
      rating: rate,
      genres: movie.genres,
      summary: movie.summary,
      language: movie.language,
      mediumImage: movie.medium_cover_image,
      largeImage: movie.large_cover_image,
      provider: 'YTS',
      torrents: movie.torrents,
    });
    newMovie.save();
  });
};

const recursiveScrap = (page, allMovies) => {
  console.log('Page', page);
  axios.get(`https://yts.ag/api/v2/list_movies.json?limit=50&page=${Number(page)}`)
  .then((movie) => {
    if (movie.data.data.movies === undefined) {
      console.log('UNDEFINED');
      writeJson(allMovies);
      return;
    }
    const { movies } = movie.data.data;
    allMovies.push(movies);
    recursiveScrap(page + 1, allMovies);
  });
};

export const scrap = (req, res) => {
  recursiveScrap(0, []);
  res.send(true);
};

const RES_PER_PAGE = 30;

export const get = async (req, res) => {
  const { error } = await Joi.validate(req.query, getMovies, { abortEarly: false });
  if (error) return res.send({ status: false, details: error.details });
  const { yearMin, yearMax, rateMin, rateMax, genre, page, asc, sort, title } = req.query;
  log(title);
  const searchObj = {
    year: { $gt: (yearMin || 1900) - 1, $lt: (Number(yearMax) || Number(2017)) + Number(1) },
    rating: { $gt: (rateMin || 0) - 1, $lt: (Number(rateMax) || Number(10)) + Number(1) },
  };
  if (genre) {
    searchObj.genres = genre;
  }
  if (title) {
    searchObj.title = new RegExp(`${title}`, 'gi');
  }
  const test = (asc || 1) ? '+' : '-';
  const tit = (sort || 'title')
  Movie.find(searchObj)
    .skip(page * RES_PER_PAGE)
    .limit(RES_PER_PAGE)
    .sort({ [sort]: asc })
    .exec()
    .then((data) => {
      res.send(data.map(movie => _.pick(movie, [
        'title',
        'rating',
        'year',
        'id',
        'largeImage',
      ])));
    })
    .catch(() => {
      res.send({ status: false, details: 'An error occurred' });
    });
};

// .sort(`${
//   // select asc or desc
//   (asc || 1) ? '+' : '-'
// }${
//   // select key
//   (sort || 'title')
// }`)

export const tenBest = (req, res) => {
  Movie.find().sort({ rating: -1 })
  .limit(8)
  .then((results) => {
    res.send(results);
  });
};

export const getGenre = (req, res) => {
  console.log('Dans Genre');
  Movie.find({ genres: req.body.genre }).sort({ title: 1 })
  .then((results) => {
    // console.log(results);
    res.send(results);
  });
};
