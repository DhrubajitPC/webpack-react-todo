import React, { useState, FC } from "react";
import "./styles";
import InputTodo from "./InputTodo";
import TodoList from "./TodoList";
import { Todo } from "./types";
import Header from "./header.txt";
import { hot } from "react-hot-loader/root";

const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      isChecked: false,
      todo: "Item 1",
    },
    {
      id: 2,
      isChecked: true,
      todo: "Item 2",
    },
  ]);

  return (
    <div className="main-container">
      <h2>{Header}</h2>
      <InputTodo onAddTodo={handleNewTodo} />
      <TodoList
        todos={todos}
        updateTodos={(newTodos: Todo[]) => setTodos(newTodos)}
      />
    </div>
  );

  function handleNewTodo(todo: string) {
    setTodos([
      ...todos,
      {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        isChecked: false,
        todo,
      },
    ]);
  }
};

export default hot(App);
