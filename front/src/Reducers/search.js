import { GET } from '../Actions/search';

export default (state = [], action) => {
  // console.log(state);
  // console.log('action', action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
    default: return state;
  }
}
