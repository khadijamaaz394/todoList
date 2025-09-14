import { useState, useEffect } from "react"
import axios from "axios"

export default function useFetchTodos(page = 1, limit = 5,sort = "desc") {
  const [todos, setTodos] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [error, setError] = useState(null)

  const fetchTodos = async () => {
    setIsLoading(true)
    setIsErrored(false)
    try {
      const res = await axios.get(
        `http://localhost:3001/get?page=${page}&limit=${limit}&sort=${sort}`
      )
      setTodos(res.data.todos)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [page, limit,sort]) // to make the page refetch/re-render-ish when page or limit changes

  return { todos, totalPages, fetchTodos, isLoading,isErrored, error }
}

