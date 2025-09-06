import React, { useState } from 'react'
import axios from "axios"

function Create({ onAdd }) {
    const [task,setTask]=useState("")
    const handleAdd=()=>{
      if (!task.trim()) {       // to stop user from adding empty strings
      alert("Please enter a task first!");
      <div>enter a task</div>
      return;
  }
        axios.post('http://localhost:3001/add',{task:task})
        .then(result=>{
        location.reload()
        })
        .catch(err=>console.log(err))
    }
  return (
    <div className='create_form'>
        <input id="input_field" value={task} type="text" placeholder='enter your task:' onChange={(e)=>setTask(e.target.value)}/>
        <button type='button' onClick={handleAdd}>Add</button>
    </div>
  )
} 

export default Create