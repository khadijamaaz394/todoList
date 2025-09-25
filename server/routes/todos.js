const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Todo = require("../Models/Todo");


let verifyToken;
try {
  const mod = require("../middleware/auth");
  verifyToken = mod.verifyToken || mod;
} catch (_e) {
  const mod = require("../middleware/authMiddleware");
  verifyToken = mod.verifyToken || mod;
}


router.use(verifyToken);

//GET
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "4", 10), 1);
    const sortDir = (req.query.sort || "desc").toLowerCase() === "asc" ? 1 : -1;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Bad user id" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

   
    const filter = { $or: [{ userId: userObjectId }, { owner: userObjectId }] };

    const [items, total] = await Promise.all([
      Todo.find(filter)
        .sort({ createdAt: sortDir })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Todo.countDocuments(filter),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("GET /api/todos failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST 
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Bad user id" });
    }

    const task = (req.body?.task ?? req.body?.text ?? "").trim();
    if (!task) return res.status(400).json({ error: "task is required" });

    const doc = await Todo.create({
      task,
      done: false,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("POST /api/todos failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH 
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad todo id" });
    }

    const update = {};
    if (typeof req.body?.task === "string") update.task = req.body.task;
    if (typeof req.body?.text === "string") update.task = req.body.text;
    if (typeof req.body?.done === "boolean") update.done = req.body.done;

    if (!Object.keys(update).length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const filter = {
      _id: id,
      $or: [{ userId: req.user.id }, { owner: req.user.id }],
    };

    const todo = await Todo.findOneAndUpdate(filter, update, { new: true });
    if (!todo) return res.status(404).json({ error: "Not found" });

    return res.json(todo);
  } catch (err) {
    console.error("PATCH /api/todos/:id failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DEL
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad todo id" });
    }

    const filter = {
      _id: id,
      $or: [{ userId: req.user.id }, { owner: req.user.id }],
    };

    const deleted = await Todo.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/todos/:id failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
