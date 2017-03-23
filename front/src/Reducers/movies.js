import { GET, SCROLL,ERROR } from '../Actions/movies';
import _ from 'lodash';

export default (state = [], action) => {
  // console.log("STATE", state);
  // console.log("Action", action);
  // console.log("MOVIES", typeof(action.payload));
  // console.log("MOVIES", action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
    case ERROR:
      return [action.payload];
    case SCROLL:
      return [...state, ...action.payload];
    default: return state;
  }
}
