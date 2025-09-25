const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      decoded.sub;

    if (!id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      id: String(id),
      username: decoded.username || decoded.name || undefined,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;          
module.exports.verifyToken = verifyToken; 
