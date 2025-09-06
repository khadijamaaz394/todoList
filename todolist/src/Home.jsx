import React, { useEffect, useState } from 'react'
import Create from './Create'
import axios from "axios"

function Home() {
  const [todos, setTodos]=useState([])

  useEffect(()=>{
    axios.get('http://localhost:3001/get')
    .then(result => setTodos(result.data))
    .catch(err => console.log(err))
  },[])

   // 👉 called when a new task is added
  const handleTaskAdded = (newTask) => {
    setTodos(prev => [...prev, newTask])   // update instantly
  }
  const handleEdit=(id)=>{
    axios.put('http://localhost:3001/update/'+id)
    .then(result => location.reload())
    .catch(err => console.log(err))
  }
  const handleDel=(id)=>{
    axios.delete('http://localhost:3001/delete/'+id)
    .then(result => location.reload())
    .catch(err => console.log(err))
  }

  return (
    
    <div className='home'>
        <h1>To Do List</h1>
        <Create onAdd={handleTaskAdded}/> 
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