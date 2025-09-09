import { useState } from "react"
import axios from "axios"

function useDeleteTodo() {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const deleteTodo = async (id) => {
    setIsLoading(true)
    setIsErrored(false)
    setIsSuccess(false)
    setError(null)

    try {
      await axios.delete(`http://localhost:3001/delete/${id}`)
      setIsSuccess(true)
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteTodo, isLoading, isErrored, isSuccess, error }
}

export default useDeleteTodo