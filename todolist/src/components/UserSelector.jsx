import { useEffect, useState } from "react"
import axios from "axios"
import { useUser } from "../context/UserContext"

export default function UserSelector() {
  const { user, setUser } = useUser()
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <label>Select User: </label>
      <select value={user?._id || ""} onChange={e => {
        const selected = users.find(u => u._id === e.target.value)
        setUser(selected)
      }}>
        <option value="">-- choose user --</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.username}</option>
        ))}
      </select>
    </div>
  )
}
