import { GET, SCROLL, ERROR } from '../Actions/series';
import _ from 'lodash';

export default (state = [], action) => {
  switch (action.type) {
    case GET:
      return action.payload;
    case ERROR:
      return [action.payload];
    case SCROLL:
      return _.flattenDepth([...state, action.payload], 1);
    default: return state;
  }
}
