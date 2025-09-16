const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../Models/User")
require("dotenv").config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "devsecret"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// signup
router.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, password required" })
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(409).json({ error: "User already exists" })

    const user = await User.create({ username, email, password })

    const payload = { id: user._id, username: user.username, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({ token, user: payload })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// login
router.post("/auth/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "emailOrUsername and password required" })
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ error: "Invalid credentials" })

    const payload = { id: user._id, username: user.username, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({ token, user: payload })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
