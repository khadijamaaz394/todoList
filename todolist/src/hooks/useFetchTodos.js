import { useState , useEffect} from "react"
import axios from "axios"

export default function useFetchTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [error, setError] = useState(null)

  const fetchTodos = async (page = 1, sort = "desc") => {
    setIsLoading(true)
    setIsErrored(false)
    setError(null)

    try {
      const res = await axios.get(`/api/todos?page=${page}&limit=4&sort=${sort}`, {
        withCredentials: true, 
      })
      setTodos(res.data.todos)
      return res.data
    } catch (err) {
      setIsErrored(true)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { todos, fetchTodos, isLoading, isErrored, error }
}
