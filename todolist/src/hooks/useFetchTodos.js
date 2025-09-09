import { useState, useEffect } from "react"
import axios from "axios"

export default function useFetchTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [error, setError] = useState(null)

  const fetchTodos = async () => {
    setIsLoading(true)
    setIsErrored(false)
    setError(null)
    try {
      const res = await axios.get("http://localhost:3001/get")
      setTodos(res.data)
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  return { todos, fetchTodos, isLoading, isErrored, error }
}