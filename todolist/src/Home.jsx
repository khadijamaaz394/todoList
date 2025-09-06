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
  const handleEdit=()=>{

  }
  const handleDel=()=>{
    
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
              <button onClick={handleEdit} className='checkBtn'>✅</button>
              <div className='taskText'><p>{todo.task}</p></div>
              
              <button onClick={handleDel} className="delBtn">🗑️</button>
            </div>
          ))
        )
        }
    </div>
  )
}

export default Home