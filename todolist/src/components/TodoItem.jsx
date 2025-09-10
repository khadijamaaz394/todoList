import React from "react"
import useUpdateTodo from "../hooks/useUpdateTodo"
import useDeleteTodo from "../hooks/useDeleteTodo"

function TodoItem({ todo, fetchTodos }) {
  const { updateTodo, isLoading: updating } = useUpdateTodo(fetchTodos)
  const { deleteTodo, isLoading: deleting } = useDeleteTodo(fetchTodos)

  return (
    <div className="task">
      <button
        onClick={() => updateTodo(todo._id, todo.done)}
        disabled={updating}
        className="checkBtn"
      >
        ✅
      </button>

      <p className={todo.done ? "taskDone" : ""}>{todo.task}</p>

      <button
        onClick={() => deleteTodo(todo._id)}
        disabled={deleting}
        className="delBtn"
      >
        🗑️
      </button>
    </div>
  )
}

export default TodoItem