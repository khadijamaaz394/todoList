import React, { createContext, useState, useEffect,useContext } from "react"
import axios from "axios"

const TodosContext = createContext()

//custom hook like useAuth()
export function useTodos(){
  const context = useContext(TodosContext)
  if(context===undefined){
    throw new Error("useTodos must be used within the TodosProvider")
}
return context
}

// Provider component
export default function TodosProvider ({ children }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

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
      const addTodo = (task) => {
         if (!task || typeof task !== "string" || !task.trim()) return
            setLoading(true)
    
        return axios.post('http://localhost:3001/add', { task })
          .then(() => {
            getTodos()      // refresh list from API
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false))
      }
      
    const updateTodo = (id, done) => {
    setLoading(true)

    return axios.put('http://localhost:3001/update/' + id, { done: !done })
      .then(() => getTodos())
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
    }

    const deleteTodo = (id) => {
    setLoading(true)
    return axios.delete('http://localhost:3001/delete/' + id)
      .then(() => getTodos())
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
      }

  return (
    <TodosContext.Provider value={{
      todos,
      loading,
      fetching,
      getTodos,
      addTodo,
      updateTodo,
      deleteTodo
    }}>
      {children}
    </TodosContext.Provider>
  )
}

