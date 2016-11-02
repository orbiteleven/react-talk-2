import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import reduxThunk from 'redux-thunk';

import '../stylesheets/main.scss';

import todos from './reducers/todos';

import App from './containers/app.jsx';

const rootReducer = combineReducers({todos});
const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('app-container'));
