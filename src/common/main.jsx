import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import '../stylesheets/main.scss';

import todos from './reducers/todos';

import App from './containers/app.jsx';

const rootReducer = combineReducers({todos});

const logger = createLogger({
  stateTransformer: (state) => {
    return Object.keys(state).reduce((newState, key) => {
      const store = state[key];
      if (typeof store.toJS === 'function') {
        return {
          ...newState,
          [key]: store,
          [`${key}JS`]: store.toJS()
        };
      }

      return {...newState, [key]: store};
    }, {});
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk, logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('app-container'));
