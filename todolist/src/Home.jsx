import React, { useContext, useState } from 'react'
import { TodosContext } from './TodosContext'  

function Home() {
  const { todos, loading, fetching, addTodo, updateTodo, deleteTodo } = useContext(TodosContext)
  const[task,setTask]=useState("")
  
  const handleAdd = () => {
    addTodo(task).then(() => setTask(""))
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
              <button onClick={()=>updateTodo(todo._id,todo.done)} className='checkBtn' disabled={loading}>✅</button>
              <div>
                <p className={todo.done ? "taskDone" : "task"}>{todo.task}</p>
              </div>
              <button onClick={()=>deleteTodo(todo._id)} className="delBtn" disabled={loading}>🗑️</button>
            </div>
          ))
        )
        }
    </div>
  )
}

export default Home