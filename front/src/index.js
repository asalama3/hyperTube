import React from 'react';
import ReactDOM from 'react-dom';
import App from './Containers/App';
import Welcome from './Containers/Welcome';
import HomePage from './Containers/HomePage';
import Series from './Containers/Series';
import Movies from './Containers/Movies';
import MoviePage from './Containers/MoviePage';
import SeriePage from './Containers/SeriePage';
import Login from './Containers/Login';
import forgotPassword from './Containers/ForgotPassword/ForgotPassword';
import Register from './Containers/Register';
import Profile from './Containers/Profile';
import editProfile from './Containers/editProfile';
import './index.css';
import { Route, Router, browserHistory } from 'react-router';
import reducers from './Reducers';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as translation from './Actions/translation';
// import * as series from './Actions/series';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import updatePassword from './Containers/ForgotPassword/UpdatePassword'
injectTapEventPlugin();

const initialState = {
  movies: [],
  movie: {},
  series: [],
  serie: {},
  search: [],
  translation: [],
  user: [],
};

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    logger(),
    thunk,
  ),
);

store.dispatch(translation.displayTranslation());

ReactDOM.render(
  <Provider store={store} >
    <MuiThemeProvider>
    	<Router history={browserHistory}>
        <Route path="/" component={Welcome}>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotPassword" component={forgotPassword} />
        	<Route path="/updatePassword" component={updatePassword} />
        </Route>
        <Route path="/app" component={App}>
          <Route path="homePage" component={HomePage}/>
          <Route path="user/profile/:id" component={Profile} />
          <Route path="user/editProfile" component={editProfile} />
          <Route path="movies" component={Movies} />
          <Route path="movies/:id" component={MoviePage} />
          <Route path="series" component={Series} />
          <Route path="serie/:id" component={SeriePage} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')

);
