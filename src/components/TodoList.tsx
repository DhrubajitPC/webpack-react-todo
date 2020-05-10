import React, { FC } from "react";
import "./styles";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

type Props = {
  updateTodos: (newTodos: Todo[]) => void;
  todos: Todo[];
};

const TodoList: FC<Props> = ({ todos, updateTodos }) => {
  return (
    <div className="todo-list">
      {todos.map(({ id, isChecked, todo }) => (
        <TodoItem
          id={id}
          key={id}
          isChecked={isChecked}
          todo={todo}
          handleCheck={(id, isChecked) => {
            const todoIndex = todos.findIndex((todo) => todo.id === id);
            const todo = { ...todos[todoIndex] } as Todo;
            todo.isChecked = isChecked;
            const newTodos = [...todos];
            newTodos[todoIndex] = todo;
            updateTodos(newTodos);
          }}
          handleDelete={(id) => {
            const newTodos = todos.filter((todo) => todo.id != id);
            updateTodos(newTodos);
          }}
        />
      ))}
    </div>
  );
};

export default TodoList;
