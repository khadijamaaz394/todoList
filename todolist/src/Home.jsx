import React, { useState } from "react"
import useFetchTodos from "./hooks/useFetchTodos"
import useAddTodo from "./hooks/useAddTodo"
import TodoItem from "./components/TodoItem"

function Home() {
  const [task, setTask] = useState("")
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("desc")  // default = newest first
  const limit = 4

  const { todos, totalPages, fetchTodos, isLoading: fetching } = useFetchTodos(page, limit,sort)
  const { addTodo, isLoading: adding } = useAddTodo(fetchTodos)

  const handleAdd = async () => {
    await addTodo(task)
    setTask("")
    setPage(1) // to get it reset to the first page after we add a new todo
  }
  const handleSortChange = (e) => {
    setSort(e.target.value)
    setPage(1) // reset to page 1 when changing sort
  }

  return (
    <div className="home">
      <h1>To Do List</h1>

      {/* Sort dropdown */}
      {todos.length > 0 && (
      <div className="sort-controls">
        <label>Sort by: </label>
        <select value={sort} onChange={handleSortChange}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      )}

      {/*input part*/}
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

      {/*output part*/}
      {fetching ? (
        <p>Loading tasks...</p>
      ) : todos.length === 0 ? (
        <h2>No tasks yet...</h2>
      ) : (
        todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} fetchTodos={fetchTodos} />
        ))
      )}

      {/*pagination part*/}
      {totalPages > 0 && (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ←
        </button>
        <span>
          Page {page} of  {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          →
        </button>
      </div>
      )}
    </div>
  )
}

export default Home