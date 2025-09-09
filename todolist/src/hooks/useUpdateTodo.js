import { useState } from "react"
import axios from "axios"
import useFetchTodos from "./useFetchTodos"

export default function useUpdateTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  

  const updateTodo = async (id, done) => {
    setIsLoading(true)
    setIsErrored(false)
    setIsSuccess(false)
    setError(null)

    try {
      await axios.put(`http://localhost:3001/update/${id}`, { done: !done })
      setIsSuccess(true)
      if (fetchTodos) fetchTodos()
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateTodo, isLoading, isErrored, isSuccess, error }
}