const jwt = require("jsonwebtoken")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET || "devsecret"

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: "No token provided" })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded 
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

module.exports = { verifyToken }
