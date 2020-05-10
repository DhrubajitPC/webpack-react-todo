import React, { FC, KeyboardEvent, useRef } from "react";
import "./styles";

type Props = {
  onAddTodo: (todo: string) => void;
};

const InputTodo: FC<Props> = ({ onAddTodo }) => {
  const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  return (
    <input
      className="input"
      ref={inputRef}
      placeholder="Add Todo"
      onKeyDown={(event: KeyboardEvent) => {
        if (event.keyCode == 13) {
          const todo = inputRef.current.value;
          if (todo) {
            onAddTodo(todo);
            inputRef.current.value = "";
          }
        }
      }}
    />
  );
};

export default InputTodo;
