const mongoose= require("mongoose")

const TodoSchema =new mongoose.Schema(
     {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
)

const TodoModel= mongoose.model("todos",TodoSchema)

module.exports= TodoModel
