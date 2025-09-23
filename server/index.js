const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const Todo = require("./Models/Todo")
const authRoutes = require("./routes/auth")
const { verifyToken } = require("./middleware/auth")

const app = express()
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err))

app.use("/auth", authRoutes)

app.get("/api/todos", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const sortOrder = req.query.sort === "asc" ? 1 : -1
    const skip = (page - 1) * limit

    const todos = await Todo.find({ userId })
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)

    const total = await Todo.countDocuments({ userId })
    res.json({ todos, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/api/todos", verifyToken, async (req, res) => {
  try {
    const { task } = req.body
    if (!task) return res.status(400).json({ error: "Task required" })
    const todo = await Todo.create({ task, userId: req.user.id })
    res.json(todo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!todo) return res.status(404).json({ error: "Not found or not yours" })
    res.json(todo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ error: "Not found or not yours" })
    res.json({ message: "Todo deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.get("/", (req, res) => res.send("API running"))

app.listen(3001, () => console.log("Server running on port 3001"))
