import React, { useState, useEffect } from "react"
import { useAuth } from "./context/AuthContext"
import useFetchTodos from "./hooks/useFetchTodos"
import useAddTodo from "./hooks/useAddTodo"
import useUpdateTodo from "./hooks/useUpdateTodo"
import useDeleteTodo from "./hooks/useDeleteTodo"
import "./App.css"

function Home() {
  const [task, setTask] = useState("")
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("desc")

  const {user,logout}=useAuth()
  const { todos, fetchTodos, isLoading: fetching } = useFetchTodos()
  const { addTodo, isLoading: adding } = useAddTodo(fetchTodos)
  const { updateTodo, isLoading: updating } = useUpdateTodo(fetchTodos)
  const { deleteTodo, isLoading: deleting } = useDeleteTodo(fetchTodos)

  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTodos(page, sort).then((res) => {
      if (res?.totalPages) setTotalPages(res.totalPages)
    })
  }, [page, sort])

  

const handleAdd = async () => {
  const res = await addTodo(task, 1, sort) 
  if (res?.totalPages) setTotalPages(res.totalPages)
  setTask("")
}

const handleDelete = async (id) => {
  const res = await deleteTodo(id, page, sort)  
  if (res?.totalPages) setTotalPages(res.totalPages)
}

const handleToggle = async (id, done) => {
  const res = await updateTodo(id, done, page, sort)  
  if (res?.totalPages) setTotalPages(res.totalPages)
}

  return (
    <div className="home">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{user.username}’s Todo List</h2>
        <button onClick={logout} className="btn logout-btn">Logout</button>
      </header>

      {/* ip */}
      <div className="create_form">
        <input
          id="input_field"
          value={task}
          type="text"
          placeholder="Enter your task"
          onChange={(e) => setTask(e.target.value)}
          disabled={adding || updating || deleting}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || !task.trim()}
        >
          {adding ? "Saving..." : "Add"}
        </button>
      </div>

      {/* sorting */}
      {todos.length > 0 && (
        <div className="sort-controls">
          <label>Sort: </label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1) 
            }}
            disabled={fetching}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      )}

      {/* display */}
      {fetching ? (
        <p>Loading tasks...</p>
      ) : todos.length === 0 ? (
        <h2>No tasks yet...</h2>
      ) : (
        todos.map((todo) => (
          <div className="task" key={todo._id}>
            <button
              onClick={() => handleToggle(todo._id, todo.done)}
              className="checkBtn"
              disabled={updating || adding || deleting}
            >
              ✅
            </button>
            <div>
              <p className={todo.done ? "taskDone" : "task"}>{todo.task}</p>
            </div>
            <button
              onClick={() => handleDelete(todo._id)}
              className="delBtn"
              disabled={deleting || adding || updating}
            >
              🗑️
            </button>
          </div>
        ))
      )}

      {/* pgnation */}
      {todos.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || fetching}
          >
            ⬅ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || fetching}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
