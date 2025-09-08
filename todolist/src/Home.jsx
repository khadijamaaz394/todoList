import React, { useEffect, useState } from 'react'
import axios from "axios"

function Home() {
  const [todos, setTodos]=useState([])
  const[task,setTask]=useState("")
  //loading the page and disabling buttons-
  const [loading, setLoading] = useState(false)   // track API calls
  const [fetching, setFetching] = useState(false) // track initial/refresh loading

  const getTodos=()=>{
    setFetching(true)
    axios.get('http://localhost:3001/get')
    .then(result => setTodos(result.data))
    .catch(err => console.log(err))
    .finally(() => setFetching(false))
  }

   // fetch tasks on first render
  useEffect(() => {
    getTodos()
  }, [])

  // handle add task
  const handleAdd = () => {
    if (!task.trim()) return  // prevent empty tasks
    setLoading(true)

    axios.post('http://localhost:3001/add', { task })
      .then(() => {
        setTask("")     // clear input
        getTodos()      // refresh list from API
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

   // called when a new task is added
  // const handleTaskAdded = (newTask) => {
  //   setTodos(prev => [...prev, newTask])   // update instantly
  // }

  const handleEdit = (id, done) => {
    setLoading(true)

    axios.put('http://localhost:3001/update/' + id, { done: !done })
      .then(() => getTodos())
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const handleDel = (id) => {
    setLoading(true)
    axios.delete('http://localhost:3001/delete/' + id)
      .then(() => getTodos())
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    
    <div className='home'>
        <h1>To Do List</h1>

        <div className='create_form'>
        <input id="input_field" value={task} type="text" placeholder='enter your task:' onChange={(e)=>setTask(e.target.value)}disabled={loading}/>
        <button type='button' onClick={handleAdd} disabled={loading}>{loading ? "Saving..." : "Add"}</button>
        </div>

         {fetching ? (
        <p>Loading tasks...</p>
      ) : todos.length === 0 ? (
        <div><h2>No tasks yet...</h2></div>
      ) : (
          todos.map(todo=>(
            <div className='task' key={todo._id}>
              <button onClick={()=>handleEdit(todo._id,todo.done)} className='checkBtn' disabled={loading}>✅</button>
              <div>
                <p className={todo.done ? "taskDone" : "task"}>{todo.task}</p>
              </div>
              <button onClick={()=>handleDel(todo._id)} className="delBtn" disabled={loading}>🗑️</button>
            </div>
          ))
        )
        }
    </div>
  )
}

export default Home