import { useState } from "react"
import axios from "axios"

export default function useAddTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const addTodo = async (task, page = 1, sort = "desc") => {
    if (!task || !task.trim()) return
    setIsLoading(true)
    setIsErrored(false)
    setIsSuccess(false)
    setError(null)

    try {
      await axios.post(
        "/api/todos",
        { task },
        { withCredentials: true }
      )
      setIsSuccess(true)

      if (fetchTodos) {
        const res = await fetchTodos(page, sort)
        return res 
      }
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { addTodo, isLoading, isErrored, isSuccess, error }
}

