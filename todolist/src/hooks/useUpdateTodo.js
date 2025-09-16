import { useState } from "react"
import axios from "axios"

export default function useUpdateTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const updateTodo = async (id, done, page = 1, sort = "desc") => {
    setIsLoading(true)
    setIsErrored(false)
    setIsSuccess(false)
    setError(null)

    try {
      await axios.put(
        `/api/todos/${id}`,
        { done: !done },
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

  return { updateTodo, isLoading, isErrored, isSuccess, error }
}
