import React from 'react';

import Todo from './todo.jsx';

const Todos = ({items, onAllComplete, onComplete}) => {
  const allComplete = items.toJS().every(todo => todo.completed);

  return (
    <section className="main">
      <input
        className="toggle-all"
        type="checkbox"
        checked={allComplete}
        onChange={evt => onAllComplete(evt.target.checked)} />
      <ul className="todo-list">
        {items.map(todo => (
          <Todo
            todo={todo}
            onComplete={onComplete}
            key={`todo-${todo.get('id')}`} />
        ))}
      </ul>
    </section>
  );
};

export default Todos;
