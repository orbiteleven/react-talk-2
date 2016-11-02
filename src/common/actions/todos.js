import {actionCreatorsFor} from 'redux-crud';
import {bindActionCreators} from 'redux';
import request from 'superagent';
import {v4} from 'uuid';

const actionCreators = actionCreatorsFor('todos', {store: 'immutable'});

export const fetchTodos = () => {
  return dispatch => {
    // This is so we can dispatch actions directly instead of:
    // dispatch(actionCreators.fetchStart());
    const {
      fetchStart,
      fetchSuccess,
      fetchError
    } = bindActionCreators(actionCreators, dispatch);

    // If we want to trigger UI
    fetchStart();

    // Make the request, handle success or failure in the callback.
    // NOTE: this should really be abstracted to a client library
    request.get('/api/todos', (error, {body}) => {
      if (error) {
        return fetchError(error);
      }

      return fetchSuccess(body);
    });
  };
};

export const addTodo = text => {
  return dispatch => {
    // This is for optimistic updates. In a production system the DB would assign an ID
    const id = v4();

    // And a fake Todo for optimistic updates
    const newTodo = {
      completed: false,
      text,
      id
    };

    const {
      createStart,
      createSuccess,
      createError
    } = bindActionCreators(actionCreators, dispatch);

    createStart(newTodo);

    request.post('/api/todos', newTodo, (error, {body}) => {
      if (error) {
        return createError(error, newTodo);
      }

      return createSuccess(body, id);
    });
  };
};

export const updateTodo = todo => {
  return dispatch => {
    const {
      updateStart,
      updateSuccess,
      updateError
    } = bindActionCreators(actionCreators, dispatch);


    updateStart(todo.toJS());

    request.put(`/api/todos/${todo.get('id')}`, todo, error => {
      if (error) {
        return updateError(error, todo.toJS());
      }

      return updateSuccess(todo.toJS());
    });
  };
};

export const setAllTodosComplete = completed => {
  return dispatch => {
    const {
      fetchStart,
      fetchSuccess,
      fetchError
    } = bindActionCreators(actionCreators, dispatch);

    // Not *really* a fetch, but we want the same ui effect
    fetchStart();

    request.post('/api/todos/markAllComplete', {completed}, (error, {body}) => {
      if (error) {
        return fetchError(error);
      }

      return fetchSuccess(body);
    });
  };
};
