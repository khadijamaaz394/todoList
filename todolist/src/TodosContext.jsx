import React, { createContext, useContext, useState } from "react"

const TodosContext = createContext()

// custom hook like useAuths()
export function useTodos() {
  const context = useContext(TodosContext)
  if (context === undefined) {
    throw new Error("useTodos must be used within the TodosProvider")
  }
  return context
}

// Provider component
export default function TodosProvider({ children }) {
  const [todos, setTodos] = useState([])

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  )
}
