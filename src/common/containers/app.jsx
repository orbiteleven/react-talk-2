import keycodes from 'keycodes';
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';

import Todos from '../components/todos.jsx';

import * as TodoActions from '../actions/todos';

const ENTER_KEY = keycodes('enter');
const ESCAPE_KEY = keycodes('escape');

class App extends Component {
  constructor(props) {
    super(props);
    this.props.fetchTodos();
  }

  handleAddTodoKeyup(evt) {
    if (evt.which === ENTER_KEY) {
      this.props.addTodo(evt.target.value);
      evt.target.value = '';
      return;
    }
    if (evt.which === ESCAPE_KEY) {
      evt.target.value = '';
      return;
    }
  }

  render() {
    const {todos, setAllTodosComplete, updateTodo} = this.props;
    return (
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyUp={this.handleAddTodoKeyup.bind(this)} />
        </header>
        <Todos
          items={todos}
          onAllComplete={
            complete => setAllTodosComplete(complete)}
          onComplete={
            todo => updateTodo(todo)} />
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.object,
  addTodo: PropTypes.func,
  fetchTodos: PropTypes.func,
  setAllTodosComplete: PropTypes.func,
  updateTodo: PropTypes.func
};

const mapDispatchToProps = TodoActions;

export default connect(state => state, mapDispatchToProps)(App);
