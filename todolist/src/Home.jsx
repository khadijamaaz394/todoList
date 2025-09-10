import React, { useState } from "react"
import useFetchTodos from "./hooks/useFetchTodos"
import useAddTodo from "./hooks/useAddTodo"
import TodoItem from "./components/TodoItem"

function Home() {
  const [task, setTask] = useState("")
  const { todos, fetchTodos, isLoading: fetching } = useFetchTodos()
  const { addTodo, isLoading: adding } = useAddTodo(fetchTodos)

  const handleAdd = async () => {
    await addTodo(task)
    setTask("")
  }

  return (
    <div className="home">
      <h1>To Do List</h1>

      <div className="create_form">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          disabled={adding}
        />
        <button onClick={handleAdd} disabled={adding}>
          {adding ? "Saving..." : "Add"}
        </button>
      </div>

      {fetching ? (
        <p>Loading tasks...</p>
      ) : todos.length === 0 ? (
        <h2>No tasks yet...</h2>
      ) : (
        todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} fetchTodos={fetchTodos} />
        ))
      )}
    </div>
  )
}

export default Home


