import React, { FC } from "react";
import "./styles";

type Props = {
  id: number;
  todo: string;
  isChecked: boolean;
  handleCheck: (id: number, isChecked: boolean) => void;
  handleDelete: (id: number) => void;
};

const TodoItem: FC<Props> = ({
  todo,
  isChecked,
  id,
  handleDelete,
  handleCheck,
}) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        id={id.toString()}
        checked={isChecked}
        onChange={() => handleCheck(id, !isChecked)}
      />
      <label
        htmlFor={id.toString()}
        style={{ textDecoration: isChecked ? "line-through" : "none" }}
      >
        {todo}
      </label>
      <span className="delete" onClick={() => handleDelete(id)}>
        <svg width="100%" viewBox="0 0 20 20" version="1.1">
          <line
            x1="10%"
            x2="90%"
            y1="10%"
            y2="90%"
            stroke="black"
            strokeWidth="3"
          />
          <line
            x1="10%"
            x2="90%"
            y1="90%"
            y2="10%"
            stroke="black"
            strokeWidth="3"
          />
        </svg>
      </span>
    </div>
  );
};

export default TodoItem;
