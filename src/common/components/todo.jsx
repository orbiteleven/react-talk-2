import classNames from 'classnames';
import React from 'react';

const Todo = ({todo, onComplete}) => {
  const completed = todo.get('completed');
  return (
    <li className={classNames({completed})}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={evt => onComplete(todo.merge({
            completed: evt.target.checked
          })) } />
        <label>{todo.get('text')}</label>
      </div>
    </li>
  );
};

export default Todo;
