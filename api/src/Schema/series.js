import mongoose from '../mongoose';

const serie = mongoose.Schema({
  id: Number,
  images: Object,
  imdb_code: String,
  num_seasons: Number,
  seenBy: Array,
  title: String,
  title_search: String,
  year: Number,
  rating: {
    type: Number,
    default: 0,
  },
  description: String,
  duration: String,
  released: String,
  cast: Array,
  genres: Array,
  directors: Array,
  writers: Array,
  review: {
    type: Object,
    default: {
      rating: {
        type: String,
        default: '-',
      },
      text: {
        type: String,
        default: '',
      },
    },
  },
  provider: String,
});

const Serie = mongoose.model('series', serie);

export default Serie;
