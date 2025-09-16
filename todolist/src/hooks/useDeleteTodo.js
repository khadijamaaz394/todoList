import { useState } from "react"
import axios from "axios"

export default function useDeleteTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

const deleteTodo = async (id, page, sort) => {
  setIsLoading(true)
  setIsErrored(false)
  setIsSuccess(false)
  setError(null)

  try {
    await axios.delete(`/api/todos/${id}`, { withCredentials: true })
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


  return { deleteTodo, isLoading, isErrored, isSuccess, error }
}
