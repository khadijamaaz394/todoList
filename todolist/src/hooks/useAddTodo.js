import { useState } from "react"
import axios from "axios"


export default function useAddTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)



  const addTodo = async (task) => {
    if (!task || typeof task !== "string" || !task.trim()) return
    setIsLoading(true)
    setIsErrored(false)
    setIsSuccess(false)
    setError(null)

    try {
      await axios.post("http://localhost:3001/add", { task })
      setIsSuccess(true)
      if (fetchTodos) fetchTodos()
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { addTodo, isLoading, isErrored, isSuccess, error }
}