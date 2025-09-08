import React, { useEffect, useState } from 'react'
import axios from "axios"

function Home() {
  const [todos, setTodos]=useState([])
  const[task,setTask]=useState("")

  const getTodos=()=>{
    axios.get('http://localhost:3001/get')
    .then(result => setTodos(result.data))
    .catch(err => console.log(err))
  }

   // fetch tasks on first render
  useEffect(() => {
    getTodos()
  }, [])

  // handle add task
  const handleAdd = () => {
    if (!task.trim()) return  // prevent empty tasks

    axios.post('http://localhost:3001/add', { task })
      .then(() => {
        setTask("")     // clear input
        getTodos()      // ✅ refresh list from API
      })
      .catch(err => console.log(err))
  }

   // 👉 called when a new task is added
  const handleTaskAdded = (newTask) => {
    setTodos(prev => [...prev, newTask])   // update instantly
  }

  const handleEdit=(id)=>{
    axios.put('http://localhost:3001/update/'+id)
    .then(() => {
        setTask("")     // clear input
        getTodos()      // ✅ refresh list from API
      })
    .catch(err => console.log(err))
  }

  const handleDel=(id)=>{
    axios.delete('http://localhost:3001/delete/'+id)
    .then(() => {
        setTask("")     // clear input
        getTodos()      // ✅ refresh list from API
      })
    .catch(err => console.log(err))
  }

  return (
    
    <div className='home'>
        <h1>To Do List</h1>
        <div className='create_form'>
        <input id="input_field" value={task} type="text" placeholder='enter your task:' onChange={(e)=>setTask(e.target.value)}/>
        <button type='button' onClick={handleAdd}>Add</button>
        </div>
        {
          todos.length===0
          ?
          <div><h2>no tasks yet...</h2></div>
          :(
          todos.map(todo=>(
            <div className='task' key={todo._id}>
              <button onClick={()=>handleEdit(todo._id)} className='checkBtn'>✅</button>
              <div>
                <p className={todo.done ? "taskDone" : "task"}>{todo.task}</p>
              </div>
              
              <button onClick={()=>handleDel(todo._id)} className="delBtn">🗑️</button>
            </div>
          ))
        )
        }
    </div>
  )
}

export default Home