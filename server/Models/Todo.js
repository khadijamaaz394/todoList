const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Todo", TodoSchema);
