import React, { useState } from "react"
import useFetchTodos from "./hooks/useFetchTodos"
import useAddTodo from "./hooks/useAddTodo"
import useUpdateTodo from "./hooks/useUpdateTodo"
import useDeleteTodo from "./hooks/useDeleteTodo"  

//imported all the hooks

function Home() {
  const[task,setTask]=useState("")
  
  const { todos, fetchTodos, isLoading: fetching } = useFetchTodos()
  const { addTodo, isLoading: adding } = useAddTodo(fetchTodos)
  const { updateTodo, isLoading: updating } = useUpdateTodo(fetchTodos)
  const { deleteTodo, isLoading: deleting } = useDeleteTodo(fetchTodos)

   const handleAdd = async () => {
    await addTodo(task)
    // shifted the fetchTodo() to individual hooks
    setTask("")
  }

  return (
    
    <div className='home'>
        <h1>To Do List</h1>

        <div className='create_form'>
            <input 
            id="input_field"
            value={task} 
            type="text" 
            placeholder='enter your task:' 
            onChange={(e)=>setTask(e.target.value)}
            disabled={adding}/>
            <button 
            type='button' 
            onClick={handleAdd} 
            disabled={adding}>
              {adding ? "Saving..." : "Add"}
            </button>
        </div>

        {fetching ? 
        (
        <p>Loading tasks...</p>
        ) : 
        todos.length === 0 ? 
        (
        <div><h2>No tasks yet...</h2></div>
        ) : 
        (
          todos.map(todo=>(
            <div className='task' key={todo._id}>

              <button 
              onClick={
                async()=>
                  {
                    await updateTodo(todo._id,todo.done)
                    fetchTodos()
                  }
                  }
                  className='checkBtn' 
                  disabled={updating}>CHECK
              </button>

              <div>
                <p className={todo.done ? "taskDone" : "task"}>{todo.task}</p>
              </div>

              <button 
                  onClick={async()=>{
                    await deleteTodo(todo._id)
                    fetchTodos()
                  }} 
                  className="delBtn" 
              disabled={deleting}>DEL
              </button>
            
            </div>
          ))
        )
        }
    </div>
  )
}

export default Home


